const mongoose = require("mongoose");

const updateFeedSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userName: { type: String, required: true, trim: true },
    action: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("UpdateFeed", updateFeedSchema);
