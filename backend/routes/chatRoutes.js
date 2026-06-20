// backend/routes/chatRoutes.js

const express = require("express");
const router = express.Router();
const { askQuestion, getChatHistory, deleteChat } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

// all chat routes are protected - user must be logged in
router.post("/ask", authMiddleware, askQuestion);
router.get("/history", authMiddleware, getChatHistory);
router.delete("/history/:id", authMiddleware, deleteChat);

module.exports = router;