// backend/models/Product.js

const mongoose = require("mongoose");

// i removed custom _id field, mongoose will auto generate objectid now
// this is needed because Review.js references productId as ObjectId
const productSchema = new mongoose.Schema({
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