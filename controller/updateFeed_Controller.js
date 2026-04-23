const asyncHandler = require("express-async-handler");
const UpdateFeed = require("../model/updateFeed_Model");

const listRecentUpdates = asyncHandler(async (_req, res) => {
  const updates = await UpdateFeed.find().sort({ createdAt: -1 }).limit(20);
  res.status(200).json(updates);
});

module.exports = { listRecentUpdates };
