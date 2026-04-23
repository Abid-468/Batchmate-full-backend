const express = require("express");
const validateToken = require("../middleware/validationTokenHandler");
const optionalAuth = require("../middleware/optionalAuth");
const { requireAdmin } = require("../middleware/validationTokenHandler");
const {
  listNotices,
  createNotice,
  deleteNotice,
} = require("../controller/notice_Controller");

const router = express.Router();

// Public route - anyone can view notices
router.get("/", optionalAuth, listNotices);

// Protected admin routes - only admins can create/delete
router.post("/", validateToken, requireAdmin, createNotice);
router.delete("/:id", validateToken, requireAdmin, deleteNotice);

module.exports = router;
