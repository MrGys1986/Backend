// loginService.js
const express = require("express");
const router = express.Router();
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const fs = require("fs");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const { generateToken } = require("../utils/jwt");

const db = admin.firestore();
const usersCollection = db.collection("users");
const loginAttempts = {}; // Control de intentos fallidos
const mfaAttempts = {};

// Login con soporte para MFA
// Cambiado de router.post("/login", ...) a router.post("/", ...) para que el endpoint sea /api/login
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const now = Date.now();
    if (loginAttempts[email] && loginAttempts[email].blockedUntil && now < loginAttempts[email].blockedUntil) {
      const remaining = Math.ceil((loginAttempts[email].blockedUntil - now) / 1000);
      return res.status(429).json({
        message: `Cuenta bloqueada. Inténtalo de nuevo en ${remaining} segundos.`,
        remaining,
      });
    }

    const userSnapshot = await usersCollection.where("email", "==", email).get();
    if (userSnapshot.empty) {
      loginAttempts[email] = loginAttempts[email] || { count: 0 };
      loginAttempts[email].count += 1;

      if (loginAttempts[email].count >= 3) {
        loginAttempts[email].blockedUntil = now + 90 * 1000;
        loginAttempts[email].count = 0;
        return res.status(429).json({
          message: "Cuenta bloqueada por 1 minuto y medio tras 3 intentos fallidos.",
          remaining: 90,
        });
      }

      return res.status(400).json({ message: "Credenciales incorrectas." });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      loginAttempts[email] = loginAttempts[email] || { count: 0 };
      loginAttempts[email].count += 1;

      if (loginAttempts[email].count >= 3) {
        loginAttempts[email].blockedUntil = now + 90 * 1000;
        loginAttempts[email].count = 0;
        return res.status(429).json({
          message: "Cuenta bloqueada por 1 minuto y medio tras 3 intentos fallidos.",
          remaining: 90,
        });
      }

      return res.status(400).json({ message: "Credenciales incorrectas." });
    }

    delete loginAttempts[email];

    // Si no tiene MFA, generamos y redirigimos a verificación
    if (!user.mfaSecret || user.mfaSecret.trim() === "") {
      const secret = speakeasy.generateSecret({ name: `EventApp WEB MFA (${email})` });
      await userDoc.ref.update({ mfaSecret: secret.base32 });
      return res.status(200).json({ mfaRequired: true, email });
    }

    return res.status(200).json({ mfaRequired: true, email });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

// Endpoint para configurar o recuperar QR MFA (muestra QR incluso si ya tiene)
router.post("/qr-mfa", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email requerido" });

  try {
    const snapshot = await usersCollection.where("email", "==", email).get();
    if (snapshot.empty) return res.status(404).json({ message: "Usuario no encontrado" });

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    let secret;
    if (user.mfaSecret && user.mfaSecret.trim() !== "") {
      secret = user.mfaSecret;
    } else {
      const generated = speakeasy.generateSecret({ name: `EventApp WEB MFA (${email})` });
      secret = generated.base32;
      await userDoc.ref.update({ mfaSecret: secret });
    }

    const otpauthUrl = speakeasy.otpauthURL({
      secret,
      label: `EventApp WEB MFA (${email})`,
      issuer: "EventApp WEB MFA",
      encoding: "base32",
    });

    const qrDataURL = await qrcode.toDataURL(otpauthUrl);

    return res.status(200).json({ qr: qrDataURL, secret });
  } catch (err) {
    console.error("Error al generar QR MFA:", err);
    return res.status(500).json({ message: "Error al generar QR" });
  }
});

// Verificación MFA
router.post("/verify-mfa", async (req, res) => {
  const { email, token } = req.body;
  if (!email || !token) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  try {
    const snapshot = await usersCollection.where("email", "==", email).get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (!user.mfaSecret) {
      return res.status(400).json({ message: "MFA no configurado para este usuario." });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    mfaAttempts[email] = mfaAttempts[email] || { count: 0 };

    if (!verified) {
      mfaAttempts[email].count += 1;

      if (mfaAttempts[email].count >= 2) {
        delete mfaAttempts[email];
        return res.status(429).json({
          message: "Código incorrecto. Has agotado tus intentos. Serás redirigido al inicio.",
          goToLogin: true,
        });
      }

      return res.status(401).json({
        message: "Código incorrecto. Por seguridad, solo tienes un intento más.",
      });
    }

    delete mfaAttempts[email];

    const jwt = generateToken({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: "Autenticación MFA exitosa",
      token: jwt,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Error en verificación MFA:", err);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

// Endpoint para configurar MFA (opcional, en caso de querer personalizar)
router.post("/setup-mfa", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email requerido" });

  try {
    const secret = speakeasy.generateSecret({ name: `EventApp WEB MFA (${email})` });
    const qrDataURL = await qrcode.toDataURL(secret.otpauth_url);

    const snapshot = await usersCollection.where("email", "==", email).get();
    if (snapshot.empty) return res.status(404).json({ message: "Usuario no encontrado" });

    const userRef = snapshot.docs[0].ref;
    await userRef.update({ mfaSecret: secret.base32 });

    return res.status(200).json({ qr: qrDataURL, secret: secret.base32 });
  } catch (err) {
    console.error("Error al generar MFA:", err);
    return res.status(500).json({ message: "Error al configurar MFA" });
  }
});

router.post("/get-security-questions", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "El correo es requerido." });
    }
    const snapshot = await usersCollection.where("email", "==", email).get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const userDoc = snapshot.docs[0];
    const user = userDoc.data();
    if (!user.securityQuestions || !Array.isArray(user.securityQuestions)) {
      return res.status(400).json({ message: "No se encontraron preguntas de seguridad." });
    }
    // Retornamos solo las preguntas
    const questions = user.securityQuestions.map(q => ({ question: q.question }));
    return res.status(200).json({ questions });
  } catch (error) {
    console.error("Error al obtener preguntas de seguridad:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

const securityAttempts = {};

router.post("/verify-security-questions", async (req, res) => {
  try {
    const { email, answers } = req.body; // answers: array de objetos { question, answer }

    if (!email || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Datos incompletos." });
    }

    const snapshot = await usersCollection.where("email", "==", email).get();
    if (snapshot.empty) return res.status(404).json({ message: "Usuario no encontrado." });

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (!user.securityQuestions || user.securityQuestions.length !== answers.length) {
      return res.status(400).json({ message: "Preguntas de seguridad no configuradas." });
    }

    // Comparar respuestas (case-insensitive)
    let allCorrect = true;
    for (let i = 0; i < answers.length; i++) {
      const provided = answers[i].answer.trim().toLowerCase();
      const stored = user.securityQuestions.find(q => q.question === answers[i].question);
      if (!stored || stored.answer.trim().toLowerCase() !== provided) {
        allCorrect = false;
        break;
      }
    }

    if (!allCorrect) {
      // Registrar intento fallido
      securityAttempts[email] = securityAttempts[email] || { count: 0 };
      securityAttempts[email].count += 1;

      if (securityAttempts[email].count >= 2) {
        delete securityAttempts[email];
        return res.status(429).json({
          message: "Respuestas incorrectas. Has agotado tus intentos. Serás redirigido al inicio.",
          goToLogin: true,
        });
      }

      return res.status(401).json({
        message: "Respuestas incorrectas. Por seguridad, solo tienes un intento más.",
      });
    }

    // Respuestas correctas, limpiar intentos
    delete securityAttempts[email];

    // Generar un nuevo QR MFA
    const secret = speakeasy.generateSecret({ name: `EventApp WEB MFA (${email})` });
    await userDoc.ref.update({ mfaSecret: secret.base32 });

    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `EventApp WEB MFA (${email})`,
      issuer: "EventApp WEB MFA",
      encoding: "base32",
    });

    const qrDataURL = await qrcode.toDataURL(otpauthUrl);
    return res.status(200).json({ qr: qrDataURL, secret: secret.base32 });
  } catch (error) {
    console.error("Error en verify-security-questions:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

module.exports = router;
