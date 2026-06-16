// backend/models/Review.js

const mongoose = require("mongoose");

// i decided to go with one document per review instead of embedding
// main reason is that i want to add ai metadata per review later
// and querying nested array fields in mongodb gets messy fast
// also embedding hits 16mb document limit if product gets lot of reviews

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "product id is requried"],
      // i index this because almost every query filters by productId
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user id is requried"],
    },

    username: {
      type: String,
      required: [true, "username is requried"],
      trim: true,
      // i store username as snapshot so even if user changes name later
      // old reviews still show correct name at time of writing
    },

    review: {
      type: String,
      required: [true, "review text is requried"],
      minlength: [10, "review must be atleast 10 charecters"],
      maxlength: [1000, "review is too long, keep it under 1000 charecters"],
      trim: true,
    },

    rating: {
      type: Number,
      required: [true, "rating is requried"],
      min: [1, "rating cant be less then 1"],
      max: [5, "rating cant be more then 5"],
    },

    // ── AI metadata fields ──────────────────────────────────────────
    // i am not using these now but i designed space for them
    // when i integrate deeper ai analysis later i just populate these

    sentimentScore: {
      type: Number,
      default: null,
      // will store value like 0.85 (positive) or 0.2 (negative)
    },

    detectedPros: {
      type: [String],
      default: [],
      // ai can extract pros from review text and store here
    },

    detectedCons: {
      type: [String],
      default: [],
    },

    aiProcessed: {
      type: Boolean,
      default: false,
      // flag to track which reviews have been analyzed by ai already
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
);

// compound index - makes sure one user can only review one product once
// mongodb will reject duplicate {userId + productId} combination
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);