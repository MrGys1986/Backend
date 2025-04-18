require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

// 🔹 Cargar credenciales de Firebase desde variables de entorno
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // ✅ CORREGIDO
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

// 🔹 Inicializar Firebase Admin con credenciales
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

// 🔹 Inicializar Express
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(bodyParser.json());

// 🔹 Importar y montar routers
const authService = require("./apis/authService");
const adminService = require("./apis/adminService");
const loginService = require("./apis/loginService");
const eventService = require("./apis/eventService");
const profileService = require("./apis/profileService");

app.use("/api/admin", adminService);
app.use("/api/auth", authService);
app.use("/api/login", loginService);
app.use("/api/event", eventService);
app.use("/api/profile", profileService);

// Ruta de prueba
app.get("/", (req, res) => res.send("Servidor funcionando correctamente 🚀"));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
