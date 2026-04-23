const express = require("express");
const validateToken = require("../middleware/validationTokenHandler");
const optionalAuth = require("../middleware/optionalAuth");
const { listRecentUpdates } = require("../controller/updateFeed_Controller");

const router = express.Router();

// Public route - anyone can view the updates feed
router.get("/", optionalAuth, listRecentUpdates);

module.exports = router;
