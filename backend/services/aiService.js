// backend/services/aiService.js

const axios = require("axios");

// this function is the only thing that knows about fastapi
// chatController just calls this and gets answer back, it dont care how
const analyzeReviews = async (question, reviews) => {
  try {
    // format reviews to only send what fastapi needs
    // i dont want to send full mongoose documents with all metadata
    // just the text fields that gemini needs to analyze
    const formattedReviews = reviews.map((r) => ({
      username: r.username,
      review: r.review,
      rating: r.rating,
    }));

    // send request to fastapi service
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/analyze`,
      {
        question,
        reviews: formattedReviews,
      },
      {
        timeout: 30000, // 30 second timeout - gemini can be slow sometimes
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // return just the result string from fastapi response
    return response.data.result;

  } catch (error) {
    // if fastapi is down or gemini fails, i throw descriptive error
    // chatController will catch this and send proper message to frontend
    if (error.code === "ECONNREFUSED") {
      throw new Error("ai service is not running, please start fastapi server");
    }

    if (error.code === "ECONNABORTED") {
      throw new Error("ai service took too long to respond, try again");
    }

    if (error.response) {
      // fastapi returned an error response
      throw new Error(`ai service error: ${error.response.data.detail || "unknown error"}`);
    }

    throw new Error(`ai service unreachable: ${error.message}`);
  }
};

module.exports = { analyzeReviews };