// backend/models/Chat.js

const mongoose = require("mongoose");

// each chat is one question + ai answer for a specific product
const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // i use this to make sure users only see there own chats
    },

    productId: {
      type: String,
      ref: "Product",
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    aiAnswer: {
      type: String,
      required: true,
      // this is the full formatted response from gemini
    },

    supportingReviews: [
      {
        username: String,
        review: String,
        rating: Number,
        // i store snapshot of reviews used so even if review is deleted later, chat still shows what was used
      },
    ],
  },
  {
    timestamps: true, // createdAt is importent here so i can sort chats by newest
  }
);

module.exports = mongoose.model("Chat", chatSchema);