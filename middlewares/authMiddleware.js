const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado o malformado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ahora puedes acceder a req.user en las rutas protegidas
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
};

module.exports = authenticateToken;
