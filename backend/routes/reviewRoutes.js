// backend/routes/reviewRoutes.js

const express = require("express");
const router = express.Router();
const { submitReview, getProductReviews } = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /reviews - protected, user must be logged in to submit review
router.post("/", authMiddleware, submitReview);

// GET /reviews/:productId - public, anyone can read reviews
router.get("/:productId", getProductReviews);

module.exports = router;