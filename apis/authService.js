// backend/apis/authService.js
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const fs = require("fs");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const { generateToken } = require("../utils/jwt");
const { getRecoveryEmailTemplate } = require("../utils/emailTemplates");

const db = admin.firestore();
const usersCollection = db.collection("users");
const recoveryAttempts = {};

// Configurar Nodemailer (para enviar códigos de recuperación)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función para generar un código de 6 dígitos
function generateRandomCode() {
  return crypto.randomInt(100000, 999999).toString();
}

// Objeto para rastrear intentos fallidos de login
const loginAttempts = {};

// ──────────────────────────────────────────────────────────────────────────────
//  1) REGISTRO: Guarda la contraseña encriptada solo si MFA es válido
// ──────────────────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    // Recibimos todos los datos necesarios del registro
    const {
      name,
      email,
      password,
      role,
      mfaCode,
      mfaSecret,
      securityQuestions,
    } = req.body;

    // Validación básica de campos obligatorios
    if (
      !name ||
      !email ||
      !password ||
      !role ||
      !mfaCode ||
      !mfaSecret ||
      !Array.isArray(securityQuestions) ||
      securityQuestions.length !== 2
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    const validRoles = ["usuario", "moderador", "administrador"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Rol inválido." });
    }

    // Verificar si el usuario ya existe
    const userSnapshot = await usersCollection
      .where("email", "==", email)
      .get();
    if (!userSnapshot.empty) {
      return res
        .status(400)
        .json({ message: "El correo ya está registrado." });
    }

    // Validar el código MFA con el secreto proporcionado
    const verified = speakeasy.totp.verify({
      secret: mfaSecret,
      encoding: "base32",
      token: mfaCode,
      window: 0, // Validación estricta: solo el código actual es válido
    });

    if (!verified) {
      return res.status(401).json({
        message:
          "❌ Código MFA incorrecto. Por seguridad debes reiniciar el proceso de registro.",
      });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Estructura del nuevo usuario
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      mfaSecret, // Se guarda el secreto validado
      securityQuestions, // Se guardan las 2 preguntas seleccionadas
      createdAt: new Date(),
    };

    // Guardar usuario en Firestore
    await usersCollection.add(newUser);
    console.log(`✅ Usuario registrado: ${email}`);

    // Generar token por si lo necesitas después
    const token = generateToken({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    // Respuesta final
    return res.status(201).json({
      message: "🎉 Usuario registrado con éxito. Redirigiendo...",
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor al registrar." });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
//  2) Endpoint para validar si un correo ya está registrado
// ──────────────────────────────────────────────────────────────────────────────

router.post("/validate-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "El correo es requerido." });
    }
    const userSnapshot = await usersCollection.where("email", "==", email).get();
    if (!userSnapshot.empty) {
      return res.status(400).json({ message: "El correo ya está registrado." });
    }
    return res.status(200).json({ message: "El correo está disponible." });
  } catch (error) {
    console.error("❌ Error al validar correo:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});


// ──────────────────────────────────────────────────────────────────────────────
//  3) SOLICITAR CÓDIGO DE RECUPERACIÓN
// ──────────────────────────────────────────────────────────────────────────────
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "El email es obligatorio." });
    }

    const userSnapshot = await usersCollection.where("email", "==", email).get();
    if (userSnapshot.empty) {
      return res.status(400).json({ message: "No existe una cuenta con este correo." });
    }

    const code = generateRandomCode(); // Genera un código de 6 dígitos
    const expiresAt = Date.now() + 15 * 60 * 1000; // Expira en 15 minutos

    const userDoc = userSnapshot.docs[0];
    await userDoc.ref.update({ resetCode: code, resetExpires: expiresAt });

    await transporter.sendMail({
      from: `"Soporte MeetEvents" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Código de Recuperación de Contraseña",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.ibb.co/nMzX7fZc/m-removebg-preview.png" alt="Logo" style="max-width: 120px;" />
          </div>
          <h2 style="text-align: center; color: #007BFF;">Recuperación de Contraseña</h2>
          <p>Hola,</p>
          <p>Tu código de recuperación es: <strong style="font-size: 24px;">${code}</strong></p>
          <p style="text-align: center; color: #888;">Este código es válido por 15 minutos.</p>
          <p>Si no solicitaste esta recuperación, ignora este mensaje.</p>
          <p>Saludos,</p>
          <p>El equipo de Soporte</p>
        </div>
      `,
    });

    console.log(`📧 Código de recuperación enviado a ${email}: ${code}`);
    return res.status(200).json({ message: "Código enviado. Revisa tu correo." });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
//  4) VALIDAR CÓDIGO DE RECUPERACIÓN
// ──────────────────────────────────────────────────────────────────────────────

router.post("/validate-code", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: "Email y código son obligatorios." });
    }

    const userSnapshot = await usersCollection
      .where("email", "==", email)
      .where("resetCode", "==", code)
      .get();

    if (userSnapshot.empty) {
      recoveryAttempts[email] = recoveryAttempts[email] || { count: 0 };
      recoveryAttempts[email].count++;

      if (recoveryAttempts[email].count >= 2) {
        delete recoveryAttempts[email];
        return res.status(429).json({
          message: "Código incorrecto. Has agotado tus intentos. Serás redirigido al inicio.",
          goToLogin: true,
        });
      }

      return res.status(400).json({ message: "Código incorrecto. Solo tienes un intento más." });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    if (Date.now() > userData.resetExpires) {
      return res.status(400).json({ message: "El código ha expirado. Solicita uno nuevo." });
    }

    delete recoveryAttempts[email];

    return res.status(200).json({ message: "Código válido. Procede a restablecer la contraseña." });

  } catch (error) {
    console.error("Error en validate-code:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
//  5) RESTABLECER LA CONTRASEÑA
// ──────────────────────────────────────────────────────────────────────────────
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email y nueva contraseña son obligatorios." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    // Buscar usuario por email
    const userSnapshot = await usersCollection.where("email", "==", email).get();
    if (userSnapshot.empty) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Verificar que la nueva contraseña sea diferente a la anterior
    const isSamePassword = await bcrypt.compare(newPassword, userData.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "La nueva contraseña no puede ser igual a la anterior." });
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userDoc.ref.update({
      password: hashedPassword,
      resetCode: null,
      resetExpires: null,
    });

    console.log(`🔐 Contraseña restablecida para: ${email}`);

    // ✅ Generar token JWT tras el restablecimiento
    const token = generateToken({
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });

    return res.status(200).json({
      message: "Contraseña restablecida exitosamente.",
      token,
      user: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    });
  } catch (error) {
    console.error("Error en reset-password:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

// Endpoint para generar QR sin registro previo (previo a guardar en la BD)
router.post("/pre-mfa-qr", async (req, res) => {
  try {
    const { email, existingSecret } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Correo requerido para generar el QR." });
    }

    const secret = existingSecret || speakeasy.generateSecret({ name: `EventApp WEB MFA (${email})` }).base32;

    const otpauthUrl = speakeasy.otpauthURL({
      secret,
      label: `EventApp WEB MFA (${email})`,
      issuer: "EventApp WEB MFA",
      encoding: "base32",
    });

    const qrDataURL = await qrcode.toDataURL(otpauthUrl);

    return res.status(200).json({
      qr: qrDataURL,
      secret,
    });
  } catch (err) {
    console.error("❌ Error al generar QR preliminar MFA:", err);
    return res.status(500).json({ message: "Error al generar QR de autenticación." });
  }
});

module.exports = router;
