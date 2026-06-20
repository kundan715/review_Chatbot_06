// backend/controllers/chatController.js

const Review = require("../models/Review");
const Product = require("../models/Product");
const Chat = require("../models/Chat");
const { analyzeReviews } = require("../services/aiService");

// ── KEYWORD FILTER ───────────────────────────────────────────────────
// i filter reviews by keywords from question before sending to gemini
// this reduces token usage and improves answer quality
// if no matches found i fall back to all reviews
const filterReviewsByKeyword = (question, reviews) => {
  // extract words from question, ignore short words like "is", "the", "a"
  const keywords = question
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 3);

  if (keywords.length === 0) return reviews;

  const filtered = reviews.filter((r) =>
    keywords.some((keyword) =>
      r.review.toLowerCase().includes(keyword)
    )
  );

  // if filter returns empty, use all reviews as fallback
  // better to send all reviews than give gemini nothing to work with
  return filtered.length > 0 ? filtered : reviews;
};

// ── ASK QUESTION ─────────────────────────────────────────────────────
const askQuestion = async (req, res) => {
  try {
    const { productId, question } = req.body;

    if (!productId || !question) {
      return res.status(400).json({ message: "productId and question are requried" });
    }

    if (question.trim().length < 5) {
      return res.status(400).json({ message: "question is too short" });
    }

    // verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    // fetch all reviews for this product from db
    const allReviews = await Review.find({ productId });

    if (allReviews.length === 0) {
      return res.status(404).json({
        message: "no reviews found for this product, cant generate answer",
      });
    }

    // filter reviews by keyword relevance to reduce tokens sent to gemini
    const relevantReviews = filterReviewsByKeyword(question, allReviews);

    // call fastapi ai service with question and relevant reviews
    const aiAnswer = await analyzeReviews(question, relevantReviews);

    // save full chat to mongodb so user can revisit later
    const savedChat = await Chat.create({
      userId: req.user.userId,
      productId,
      question,
      aiAnswer,
      // i store snapshot of reviews used so history always shows what was analyzed
      supportingReviews: relevantReviews.map((r) => ({
        username: r.username,
        review: r.review,
        rating: r.rating,
      })),
    });

    res.status(200).json({
      message: "answer generated succesfuly",
      chatId: savedChat._id,
      productName: product.name,
      question,
      aiAnswer,
      supportingReviews: savedChat.supportingReviews,
    });
  } catch (error) {
    console.error("error in askQuestion:", error.message);

    // pass ai service errors directly to frontend so user knows whats wrong
    if (error.message.includes("ai service")) {
      return res.status(503).json({ message: error.message });
    }

    res.status(500).json({ message: "server error while generating answer" });
  }
};

// ── GET CHAT HISTORY ──────────────────────────────────────────────────
const getChatHistory = async (req, res) => {
  try {
    // i only fetch chats belonging to logged in user
    // req.user.userId comes from jwt token via authMiddleware
    const chats = await Chat.find({ userId: req.user.userId })
      .sort({ createdAt: -1 }) // newest first
      .populate("productId", "name brand"); // attach product name and brand

    res.status(200).json({
      count: chats.length,
      chats,
    });
  } catch (error) {
    console.error("error fetching chat history:", error.message);
    res.status(500).json({ message: "server error while fetching chat history" });
  }
};

// ── DELETE CHAT ───────────────────────────────────────────────────────
const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({ message: "chat not found" });
    }

    // ownership check - user can only delete their own chats
    // this is critical security step, i never skip this
    if (chat.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "not authorized to delete this chat" });
    }

    await Chat.findByIdAndDelete(id);

    res.status(200).json({ message: "chat deleted succesfuly" });
  } catch (error) {
    console.error("error deleting chat:", error.message);
    res.status(500).json({ message: "server error while deleting chat" });
  }
};

module.exports = { askQuestion, getChatHistory, deleteChat };