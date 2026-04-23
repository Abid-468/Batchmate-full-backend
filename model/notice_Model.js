const mongoose = require("mongoose");

const noticeSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notice", noticeSchema);
