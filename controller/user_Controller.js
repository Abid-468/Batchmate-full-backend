const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user_Model");
const jwtSecret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET;

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite =
    process.env.COOKIE_SAMESITE || (isProduction ? "none" : "lax");
  const secure = sameSite === "none" ? true : isProduction;
  return {
    httpOnly: true,
    sameSite,
    secure,
    maxAge: 24 * 60 * 60 * 1000,
  };
}

const register_User = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email: email.toLowerCase() });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }
  const hashedpass = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase().trim(),
    password: hashedpass,
    role:
      email.toLowerCase().trim() === "admin@batchmate.com"
        ? "admin"
        : "student",
  });
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email, role: user.role });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

const login_User = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  if (user && (await bcrypt.compare(password, user.password))) {
    if (!jwtSecret) {
      res.status(500);
      throw new Error("JWT secret is not configured");
    }

    const accessToken = jwt.sign(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      jwtSecret,
      { expiresIn: "1d" },
    );
    res.cookie("token", accessToken, getCookieOptions());
    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

module.exports = { register_User, login_User };
