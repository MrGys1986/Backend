// backend/apis/profileService.js
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// GET /api/profile/userinfo?email=...
router.get("/userinfo", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email requerido." });
    }

    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Devolvemos la info del usuario que interese (p.ej. name, role, createdAt, etc.)
    return res.status(200).json({
      user: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt || null,
      },
    });
  } catch (error) {
    console.error("Error en /userinfo:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener datos del usuario." });
  }
});

// GET /api/profile/compras?email=...
router.get("/compras", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email requerido." });
    }

    // Buscamos compras en la colección "compras" donde userId = email
    const comprasSnapshot = await db
      .collection("compras")
      .where("userId", "==", email)
      .get();

    // Si no hay compras, devolvemos un array vacío
    if (comprasSnapshot.empty) {
      return res.status(200).json({ purchases: [] });
    }

    const allPurchases = [];
    for (const doc of comprasSnapshot.docs) {
      const compraData = doc.data();
      // Cargamos info adicional del evento
      const eventRef = db.collection("eventos").doc(compraData.eventId);
      const eventDoc = await eventRef.get();
      if (!eventDoc.exists) {
        // Si el evento ya no existe, podemos omitir o manejar error
        continue;
      }
      const eventData = eventDoc.data();

      allPurchases.push({
        eventId: compraData.eventId,
        nombre: eventData.nombre,
        fecha: eventData.fecha,
        basico: compraData.basico,
        premium: compraData.premium,
        vip: compraData.vip,
      });
    }

    return res.status(200).json({ purchases: allPurchases });
  } catch (error) {
    console.error("Error en /compras:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener las compras." });
  }
});

module.exports = router;
