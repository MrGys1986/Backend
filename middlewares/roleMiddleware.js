const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Acceso denegado. Rol no autorizado." });
      }
      next();
    };
  };
  
  module.exports = authorizeRoles;
  