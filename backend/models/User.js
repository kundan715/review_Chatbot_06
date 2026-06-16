// backend/models/User.js

const mongoose = require("mongoose");

// this schema define what a user look like in database
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is requried"],
      trim: true, // removes extra spaces from start and end
    },

    email: {
      type: String,
      required: [true, "email is requried"],
      unique: true, // no two users can have same email
      lowercase: true, // i always store email in lowercase to avoid duplicates like User@gmail and user@gmail
      trim: true,
    },

    passwordHash: {
      type: String,
      required: [true, "password is requried"],
      // i never store plain password here, only bcrypt hash
    },
  },
  {
    timestamps: true, // this auto adds createdAt and updatedAt fields, i dont need to do it manually
  }
);

// i export the model so controllers can use it
module.exports = mongoose.model("User", userSchema);