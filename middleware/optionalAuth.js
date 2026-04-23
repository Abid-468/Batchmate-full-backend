const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET;

// Optional authentication - sets req.user if token exists, but doesn't require it
const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (token && jwtSecret) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      if (decoded && decoded.user) {
        req.user = decoded.user;
      }
    } catch (_err) {
      // Invalid token - don't set user, but don't block request
    }
  }

  next();
});

module.exports = optionalAuth;
