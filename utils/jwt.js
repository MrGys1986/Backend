const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      uid: user.uid || user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
