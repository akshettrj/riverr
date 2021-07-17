const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
  userID: {
    unique: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  contactNumber: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (v) {
        const contactRegExp = /^\d{10}$/;
        return contactRegExp.test(v);
      },
      message: "The contact number is not a number",
    },
  },
  bio: {
    type: String,
    required: [true, "Please fill your bio"],
    validate: {
      validator: function (v) {
        v = v.replace(/(^\s*)|(\s*$)/gi, "");
        v = v.replace(/[ ]{2,}/gi, " ");
        v = v.replace(/\n /, "\n");
        const textWords = v.split(" ");
        return textWords.length <= 250;
      },
      message: "The bio exceeds the limit",
    },
  },
});

module.exports = mongoose.model("Recruiter", recruiterSchema);
