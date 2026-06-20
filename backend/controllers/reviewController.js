// backend/controllers/reviewController.js

const Review = require("../models/Review");
const Product = require("../models/Product");

// ── SUBMIT REVIEW ────────────────────────────────────────────────────
const submitReview = async (req, res) => {
  try {
    const { productId, review, rating } = req.body;

    // basic validation before touching database
    if (!productId || !review || !rating) {
      return res.status(400).json({ message: "productId, review and rating are requried" });
    }

    // check product actually exists in db
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    // check if user already reviewed this product
    // compound index on userId+productId handles this but i check manually for better error message
    const existingReview = await Review.findOne({
      userId: req.user.userId,
      productId,
    });

    if (existingReview) {
      return res.status(400).json({ message: "you already reviewed this product" });
    }

    // create the review - userId comes from jwt token, not from request body
    // i never trust client to send their own userId, always use token
    const newReview = await Review.create({
      productId,
      userId: req.user.userId,
      username: req.user.email.split("@")[0], // i use email prefix as username for now
      review,
      rating: Number(rating),
    });

    res.status(201).json({
      message: "review submitted succesfuly",
      review: newReview,
    });
  } catch (error) {
    // mongoose duplicate key error - user already reviewed this product
    if (error.code === 11000) {
      return res.status(400).json({ message: "you already reviewed this product" });
    }
    console.error("error submitting review:", error.message);
    res.status(500).json({ message: "server error while submitting review" });
  }
};

// ── GET REVIEWS FOR A PRODUCT ────────────────────────────────────────
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // check product exists first
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    // fetch all reviews for this product, newest first
    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      productId,
      productName: product.name,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("error fetching reviews:", error.message);
    res.status(500).json({ message: "server error while fetching reviews" });
  }
};

module.exports = { submitReview, getProductReviews };