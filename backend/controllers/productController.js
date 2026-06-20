// backend/controllers/productController.js

const Product = require("../models/Product");

// this controller just fetch all products from db and send to frontend
// no auth needed here, anyone can see product list
const getAllProducts = async (req, res) => {
  try {
    // i fetch all products, no filter needed
    // sort by name so list always appear in same order
    const products = await Product.find({}).sort({ name: 1 });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "no products found" });
    }

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("error fetching products:", error.message);
    res.status(500).json({ message: "server error while fetching products" });
  }
};

module.exports = { getAllProducts };
