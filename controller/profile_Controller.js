const asyncHandler = require("express-async-handler");
const Profile = require("../model/profile_Model");
const User = require("../model/user_Model");
const UpdateFeed = require("../model/updateFeed_Model");

function sanitizeProfile(profileDoc, viewerUserId, isOwner) {
  const profile = profileDoc.toObject
    ? profileDoc.toObject()
    : { ...profileDoc };
  if (!isOwner) {
    if (profile.hideHometown) profile.hometown = "";
    if (profile.hideFatherName) profile.fatherName = "";
    if (profile.hideMotherName) profile.motherName = "";
  }
  profile.isOwner = isOwner;
  profile.viewerUserId = viewerUserId;
  return profile;
}

async function logUpdate(userId, userName, action) {
  await UpdateFeed.create({ userId, userName, action });
}

const getCurrentProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("name email role");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  let profile = await Profile.findOne({ userId: req.user.id });
  if (!profile) {
    profile = await Profile.create({
      userId: user.id,
      name: user.name,
      email: user.email,
    });
    await logUpdate(user.id, user.name, "created their profile");
  }
  return res.status(200).json(sanitizeProfile(profile, req.user.id, true));
});

const upsertCurrentProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("name email");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const payload = { ...req.body };
  payload.name = (payload.name || "").trim();
  if (!payload.name) {
    return res.status(400).json({ message: "Full name is required" });
  }
  payload.email = user.email;
  payload.userId = user.id;

  const existing = await Profile.findOne({ userId: user.id });
  const updated = await Profile.findOneAndUpdate({ userId: user.id }, payload, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });

  if (!existing) {
    await logUpdate(user.id, payload.name, "created their profile");
  } else {
    await logUpdate(user.id, payload.name, "updated their profile");
  }

  return res.status(200).json(sanitizeProfile(updated, req.user.id, true));
});

const uploadCurrentProfilePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const user = await User.findById(req.user.id).select("name email");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const photoUrl = `/uploads/${req.file.filename}`;
  const profile = await Profile.findOneAndUpdate(
    { userId: user.id },
    {
      userId: user.id,
      name: user.name,
      email: user.email,
      photoUrl,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await logUpdate(user.id, profile.name, "updated profile photo");
  return res
    .status(200)
    .json({ photoUrl, profile: sanitizeProfile(profile, req.user.id, true) });
});

const getPublicProfiles = asyncHandler(async (req, res) => {
  const { name, city, country } = req.query;
  const filter = {};
  if (name) {
    filter.name = { $regex: String(name).trim(), $options: "i" };
  }
  if (city || country) {
    const parts = [city, country]
      .filter(Boolean)
      .map((v) => String(v).trim())
      .join(" ");
    filter.currentCityCountry = { $regex: parts, $options: "i" };
  }

  const profiles = await Profile.find(filter).sort({ updatedAt: -1 });
  const viewerUserId = req.user?.id || null;
  const sanitized = profiles.map((p) =>
    sanitizeProfile(p, viewerUserId, String(p.userId) === String(viewerUserId)),
  );
  return res.status(200).json(sanitized);
});

const getPublicProfileById = asyncHandler(async (req, res) => {
  // Check if the id is "search" to avoid conflict with query routes
  if (req.params.id === "search" || req.params.id === "me") {
    return res.status(400).json({ message: "Invalid profile id" });
  }

  const profile = await Profile.findById(req.params.id);
  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }
  const viewerUserId = req.user?.id || null;
  const isOwner =
    viewerUserId && String(profile.userId) === String(viewerUserId);
  return res.status(200).json(sanitizeProfile(profile, viewerUserId, isOwner));
});

module.exports = {
  getCurrentProfile,
  upsertCurrentProfile,
  uploadCurrentProfilePhoto,
  getPublicProfiles,
  getPublicProfileById,
};
