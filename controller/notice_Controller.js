const asyncHandler = require("express-async-handler");
const Notice = require("../model/notice_Model");

const listNotices = asyncHandler(async (_req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 }).limit(100);
  res.status(200).json(notices);
});

const createNotice = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }
  const notice = await Notice.create({
    title: String(title).trim(),
    description: String(description).trim(),
    postedBy: req.user.id,
  });
  res.status(201).json(notice);
});

const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    return res.status(404).json({ message: "Notice not found" });
  }
  await Notice.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Notice deleted" });
});

module.exports = { listNotices, createNotice, deleteNotice };
