const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const authenticateToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const db = admin.firestore();
const usersCollection = db.collection("users");

// 🟢 Obtener todos los usuarios (solo admins)
router.get("/users", authenticateToken, authorizeRoles("administrador"), async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error interno al obtener usuarios." });
  }
});

// 🟡 Actualizar rol de usuario
router.put("/users/:id/role", authenticateToken, authorizeRoles("administrador"), async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["usuario", "moderador", "administrador"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Rol inválido." });
    }

    await usersCollection.doc(req.params.id).update({ role });
    res.json({ message: "Rol actualizado correctamente." });
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    res.status(500).json({ message: "Error interno al actualizar rol." });
  }
});

// 🔴 Eliminar usuario
router.delete("/users/:id", authenticateToken, authorizeRoles("administrador"), async (req, res) => {
  try {
    await usersCollection.doc(req.params.id).delete();
    res.json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error interno al eliminar usuario." });
  }
});

module.exports = router;
