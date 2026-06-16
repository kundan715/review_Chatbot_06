// backend/models/Product.js

const mongoose = require("mongoose");

// products are pre loaded by seed script, users cant create them
const productSchema = new mongoose.Schema({
  _id: {
    type: String, // i use custom string ids like "p1", "p2" instead of auto objectId
  },

  name: {
    type: String,
    required: true,
  },

  brand: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);