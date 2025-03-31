const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { generateToken } = require("../utils/jwt");
const nodemailer = require("nodemailer");

const db = admin.firestore();
const eventosCollection = db.collection("eventos");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Tu correo
      pass: process.env.EMAIL_PASS, // Tu contraseña o app password
    },
  });

// Endpoint para obtener todas las categorías únicas
router.get("/categorias", async (req, res) => {
  try {
    const snapshot = await eventosCollection.get();
    const categorias = new Set();

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.categoria) {
        categorias.add(data.categoria.trim());
      }
    });

    return res.status(200).json({ categorias: Array.from(categorias) });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return res.status(500).json({ message: "Error al obtener categorías." });
  }
});

// Endpoint para obtener todas las ubicaciones únicas
router.get("/ubicaciones", async (req, res) => {
  try {
    const snapshot = await eventosCollection.get();
    const ubicaciones = new Set();

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.lugar) {
        ubicaciones.add(data.lugar.trim());
      }
    });

    return res.status(200).json({ ubicaciones: Array.from(ubicaciones) });
  } catch (error) {
    console.error("Error al obtener ubicaciones:", error);
    return res.status(500).json({ message: "Error al obtener ubicaciones." });
  }
});

// Obtener todos los eventos
router.get("/todos", async (req, res) => {
    try {
      const snapshot = await eventosCollection.get();
      const eventos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return res.status(200).json({ eventos });
    } catch (error) {
      console.error("Error al obtener eventos:", error);
      return res.status(500).json({ message: "Error al obtener eventos." });
    }
  });

  // SSE: /api/event/stream
  router.get("/stream/:id", async (req, res) => {
    const eventId = req.params.id;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
  
    const sendEvent = async () => {
      try {
        const snapshot = await eventosCollection.doc(eventId).get();
        if (!snapshot.exists) {
          res.write(`data: ${JSON.stringify({ error: "Evento no encontrado" })}\n\n`);
          return;
        }
        res.write(`data: ${JSON.stringify({ evento: snapshot.data() })}\n\n`);
      } catch (err) {
        console.error("Error SSE:", err);
      }
    };
  
    const interval = setInterval(sendEvent, 90000);
 // actualiza cada 5s
  
    req.on("close", () => {
      clearInterval(interval);
      res.end();
    });
  });
  
  // Obtener evento por ID
router.get("/uno/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const doc = await eventosCollection.doc(id).get();
  
      if (!doc.exists) {
        return res.status(404).json({ message: "Evento no encontrado." });
      }
  
      return res.status(200).json({ evento: { id: doc.id, ...doc.data() } });
    } catch (error) {
      console.error("Error al obtener evento por ID:", error);
      return res.status(500).json({ message: "Error al obtener evento." });
    }
  });  
  
  router.post("/comprar", async (req, res) => {
    try {
      const { userId, eventId, tickets } = req.body; 
      // Aquí userId es el correo del usuario
  
      // 1) Verificar si el usuario existe buscando por email
      const userQuery = await db
        .collection("users")
        .where("email", "==", userId)
        .limit(1)
        .get();
      if (userQuery.empty) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }
      const userDoc = userQuery.docs[0];
      const userData = userDoc.data();
  
      // 2) Verificar si el evento existe
      const eventRef = db.collection("eventos").doc(eventId);
      const eventDoc = await eventRef.get();
      if (!eventDoc.exists) {
        return res.status(400).json({ message: "Evento no encontrado" });
      }
      const eventData = eventDoc.data();
  
      // 3) Obtener la disponibilidad actual de cada tipo de boleto
      const disponiblesBasico = eventData.disponibilidad?.basico?.disponibles || 0;
      const disponiblesPremium = eventData.disponibilidad?.premium?.disponibles || 0;
      const disponiblesVip = eventData.disponibilidad?.vip?.disponibles || 0;
  
      // 4) Extraer cuántos boletos se quieren comprar
      const comprandoBasico = tickets.basico || 0;
      const comprandoPremium = tickets.premium || 0;
      const comprandoVip = tickets.vip || 0;
  
      // Validar que haya suficientes boletos disponibles
      if (
        comprandoBasico > disponiblesBasico ||
        comprandoPremium > disponiblesPremium ||
        comprandoVip > disponiblesVip
      ) {
        return res.status(400).json({
          message: "No hay suficientes boletos disponibles en alguna de las categorías.",
        });
      }
  
      // 5) Registrar la compra en Firestore
      const compraData = {
        userId, // correo del usuario
        eventId,
        basico: comprandoBasico,
        premium: comprandoPremium,
        vip: comprandoVip,
        createdAt: new Date(),
      };
      await db.collection("compras").add(compraData);
  
      // 6) Actualizar la disponibilidad del evento
      await eventRef.update({
        "disponibilidad.basico.disponibles": disponiblesBasico - comprandoBasico,
        "disponibilidad.premium.disponibles": disponiblesPremium - comprandoPremium,
        "disponibilidad.vip.disponibles": disponiblesVip - comprandoVip,
      });
  
      // Calcular totales
      const subtotal =
        comprandoBasico * (eventData.disponibilidad.basico.precio || 0) +
        comprandoPremium * (eventData.disponibilidad.premium.precio || 0) +
        comprandoVip * (eventData.disponibilidad.vip.precio || 0);
      const tax = subtotal * 0.16;
      const total = subtotal + tax;
  
      // 7) Preparar el correo de confirmación
      const emailHtml = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f6f6f6;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      
      <!-- Imagen centrada -->
      <div style="text-align: center; padding-top: 20px;">
        <img src="https://i.ibb.co/nMzX7fZc/m-removebg-preview.png" alt="Logo" style="max-width: 180px;" />
      </div>

      <!-- Encabezado -->
      <div style="padding: 20px; text-align: center; background: #4CAF50; color: #fff; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Confirmación de Compra</h1>
      </div>

      <!-- Contenido principal -->
      <div style="padding: 20px;">
        <p>Hola ${userData.name},</p>
        <p>Gracias por tu compra para el evento <strong>${eventData.nombre}</strong>.</p>
        <p>A continuación se detalla tu compra:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
          <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Tipo de boleto</th>
            <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Cantidad</th>
            <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Precio Unitario</th>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">Básico</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${comprandoBasico}</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">$${eventData.disponibilidad.basico.precio}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">Premium</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${comprandoPremium}</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">$${eventData.disponibilidad.premium.precio}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">VIP</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">${comprandoVip}</td>
            <td style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">$${eventData.disponibilidad.vip.precio}</td>
          </tr>
        </table>

        <p style="text-align: right; font-size: 18px; font-weight: bold; margin-top: 16px;">
          Total: $${total.toFixed(2)}
        </p>

        <p style="margin-top: 24px;">Revisa tu <strong>Superperfil</strong> para ver el estado de tu compra.</p>
        <p>Se te ha enviado este correo con todos los detalles. ¡Disfruta del evento!</p>
      </div>

      <!-- Footer -->
      <div style="padding: 20px; text-align: center; background: #f0f0f0; border-radius: 0 0 8px 8px; font-size: 12px; color: #777;">
        <p>Si tienes alguna duda, contáctanos a <a href="mailto:support@example.com">support@example.com</a></p>
      </div>
    </div>
  </div>
`;
  
      // 8) Enviar el correo de confirmación
      await transporter.sendMail({
        from: `"Soporte EventApp" <${process.env.EMAIL_USER}>`,
        to: userId,
        subject: `Confirmación de Compra - ${eventData.nombre}`,
        html: emailHtml,
      });
  
      return res.status(200).json({ message: "Compra registrada, boletos actualizados y correo de confirmación enviado." });
    } catch (error) {
      console.error("Error en comprar:", error);
      return res.status(500).json({ message: "Error interno al comprar boletos." });
    }
  });

  router.post("/soporte", async (req, res) => {
    try {
      const { correo, mensaje } = req.body;
  
      if (!correo || !mensaje) {
        return res.status(400).json({ message: "Faltan datos de formulario." });
      }
  
      // 1) Enviar correo a tu equipo de soporte
      const staffEmailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2>Nuevo caso de soporte</h2>
          <p><strong>Usuario:</strong> ${correo}</p>
          <p><strong>Mensaje:</strong> ${mensaje}</p>
        </div>
      `;
  
      await transporter.sendMail({
        from: `"Soporte EventApp" <${process.env.EMAIL_USER}>`,
        to: "soporte@eventapp.com", // el correo de tu equipo de soporte
        subject: "Nuevo caso de soporte",
        html: staffEmailHtml,
      });
  
      // 2) Enviar correo de confirmación al usuario
      const userEmailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2>¡Hemos recibido tu caso de soporte! 🙌</h2>
          <p>Hola, muchas gracias por contactarnos. Nuestro equipo revisará tu caso a la brevedad.</p>
          <p><strong>Tu mensaje:</strong> ${mensaje}</p>
          <p>En breve recibirás una respuesta en tu correo <strong>${correo}</strong>.</p>
          <p>¡Gracias por confiar en EventApp!</p>
        </div>
      `;
  
      await transporter.sendMail({
        from: `"Soporte EventApp" <${process.env.EMAIL_USER}>`,
        to: correo, // enviamos al usuario
        subject: "Hemos recibido tu caso de soporte",
        html: userEmailHtml,
      });
  
      return res.status(200).json({ message: "Caso de soporte enviado con éxito." });
    } catch (error) {
      console.error("Error en /soporte:", error);
      return res.status(500).json({ message: "Error al procesar el formulario de soporte." });
    }
  });
  
  module.exports = router;
  
  


