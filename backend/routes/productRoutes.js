// backend/routes/productRoutes.js

const express = require("express");
const router = express.Router();
const { getAllProducts } = require("../controllers/productController");

// GET /products - no auth middleware here, public route
router.get("/", getAllProducts);

module.exports = router;