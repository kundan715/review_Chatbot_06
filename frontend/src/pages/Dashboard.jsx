// frontend/src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import Loader from "../components/Loader.jsx";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // i get user from localStorage to show welcome message
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://ai-review-backend-qo8l.onrender.com/products");
      setProducts(response.data.products);
    } catch (err) {
      setError("failed to load products, please refresh");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryEmoji = (category) => {
    const map = {
      Smartphone: "📱",
      Laptop: "💻",
      Headphones: "🎧",
      Tablet: "📟",
      Camera: "📷",
    };
    return map[category] || "🛍️";
  };

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">

        <div className="dashboard-header">
          <h1 className="dashboard-title">Hey, {user.name || "there"} 👋</h1>
          <p className="dashboard-subtitle">
            select a product to ask ai powered questions from real reviews
          </p>
        </div>

        {loading && <Loader message="fetching products..." />}

        {error && (
          <div className="card error-card">
            <p className="error-msg">{error}</p>
            <button
              className="btn btn-primary retry-btn"
              onClick={fetchProducts}
            >
              retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="products-grid">
            {products.map((product) => (
              <div
                key={product._id}
                className="card product-card"
                onClick={() => navigate(`/chat/${product._id}`)}
              >
                <div className="product-emoji">
                  {getCategoryEmoji(product.category)}
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-brand">{product.brand}</p>
                <span className="product-category-badge">{product.category}</span>
                <p className="product-cta">ask ai about this →</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;