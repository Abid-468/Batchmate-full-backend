const mongoose = require("mongoose");

const profileSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    photoUrl: { type: String, default: "" },
    bloodGroup: { type: String, default: "" },
    hometown: { type: String, default: "" },
    hideHometown: { type: Boolean, default: false },
    schoolName: { type: String, default: "" },
    collegeName: { type: String, default: "" },
    fatherName: { type: String, default: "" },
    hideFatherName: { type: Boolean, default: false },
    motherName: { type: String, default: "" },
    hideMotherName: { type: Boolean, default: false },
    phoneNumber: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    currentCityCountry: { type: String, default: "" },
    profession: { type: String, default: "" },
    desiredJobSector: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 500 },
    hobbies: { type: String, default: "" },
    passions: { type: String, default: "" },
  },
  { timestamps: true },
);

profileSchema.index({ name: "text", currentCityCountry: "text" });

module.exports = mongoose.model("Profile", profileSchema);
