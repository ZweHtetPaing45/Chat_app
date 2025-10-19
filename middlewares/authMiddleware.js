const { verifyToken } = require("../controllers/authController");

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  const user = verifyToken(token);
  if (!user) return res.status(401).json({ message: "Invalid token" });

  req.user = user;
  next();
}

module.exports = authMiddleware;