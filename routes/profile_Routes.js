const express = require("express");
const validateToken = require("../middleware/validationTokenHandler");
const optionalAuth = require("../middleware/optionalAuth");
const upload = require("../middleware/upload");
const {
  getCurrentProfile,
  upsertCurrentProfile,
  uploadCurrentProfilePhoto,
  getPublicProfiles,
  getPublicProfileById,
} = require("../controller/profile_Controller");

const router = express.Router();

// Protected routes - require authentication
router.get("/me/current", validateToken, getCurrentProfile);
router.put("/me/current", validateToken, upsertCurrentProfile);
router.post(
  "/me/photo",
  validateToken,
  upload.single("photo"),
  uploadCurrentProfilePhoto,
);

// Public routes - optional auth (works without token, but can use token to identify viewer)
router.get("/", optionalAuth, getPublicProfiles);
router.get("/:id", optionalAuth, getPublicProfileById);

module.exports = router;
