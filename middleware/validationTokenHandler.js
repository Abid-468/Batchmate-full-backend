const asyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET;

const validateToken=asyncHandler(async(req,res,next)=>{
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "No token provided, authorization denied",
      });
    }

    try {
      if (!jwtSecret) {
        return res.status(500).json({ message: "JWT secret is not configured" });
      }

      const decoded = jwt.verify(token, jwtSecret);
      if (!decoded || !decoded.user) {
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = decoded.user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "User is not authorized" });
    }
});

module.exports = validateToken;

module.exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};