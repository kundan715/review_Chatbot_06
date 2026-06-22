// backend/server.js

require("./models/User");
require("./models/Product");
require("./models/Review");
require("./models/Chat");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables first — before anything else
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: "https://review-chatbot-06.vercel.app/",
  credentials: true
}));

app.use(express.json()); // Parse incoming JSON request bodies

// Health check route — useful for verifying server is alive
app.get("/", (req, res) => {
  res.json({ message: "AI Review Platform API is running" });
});

// Routes — i  will uncomment these as i  build them
app.use("/auth", require("./routes/authRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/reviews", require("./routes/reviewRoutes"));
app.use("/chat", require("./routes/chatRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});