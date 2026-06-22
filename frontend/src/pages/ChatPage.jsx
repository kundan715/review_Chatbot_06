

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { askQuestion, getChatHistory, deleteChat } from "../services/chatApi.js";
import { submitReview, getProductReviews } from "../services/reviewApi.js";
import Navbar from "../components/Navbar.jsx";
import Loader from "../components/Loader.jsx";
import axios from "axios";
import "./ChatPage.css";

function ChatPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [question, setQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [productReviews, setProductReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchHistory();
  }, [productId]);

  useEffect(() => {
    if (currentAnswer) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentAnswer]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get("https://ai-review-backend-qo8l.onrender.com/products");
      const found = response.data.products.find((p) => p._id === productId);
      if (!found) { navigate("/dashboard"); return; }
      setProduct(found);
    } catch (err) {
      navigate("/dashboard");
    }
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const data = await getChatHistory();
      const productChats = data.chats.filter(
        (c) => c.productId?._id === productId || c.productId === productId
      );
      setHistory(productChats);
    } catch (err) {
      console.error("failed to fetch history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchProductReviews = async () => {
    try {
      setReviewsLoading(true);
      const data = await getProductReviews(productId);
      setProductReviews(data.reviews);
    } catch (err) {
      console.error("failed to fetch reviews");
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) { setChatError("please type a question"); return; }
    try {
      setChatLoading(true);
      setChatError("");
      setCurrentAnswer(null);
      const data = await askQuestion(productId, question);
      setCurrentAnswer(data);
      setQuestion("");
      fetchHistory();
    } catch (err) {
      setChatError(err.response?.data?.message || "failed to get answer, try again");
    } finally {
      setChatLoading(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);
      setHistory((prev) => prev.filter((c) => c._id !== chatId));
      if (currentAnswer?.chatId === chatId) setCurrentAnswer(null);
    } catch (err) {
      console.error("failed to delete chat");
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) { setReviewError("please write a review"); return; }
    if (reviewText.length < 10) { setReviewError("review must be atleast 10 charecters"); return; }
    try {
      setReviewLoading(true);
      setReviewError("");
      setReviewSuccess("");
      await submitReview(productId, reviewText, reviewRating);
      setReviewSuccess("review submitted succesfuly!");
      setReviewText("");
      setReviewRating(5);
      fetchProductReviews();
    } catch (err) {
      setReviewError(err.response?.data?.message || "failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const formatAnswer = (text) => {
    return text.split("\n").map((line, i) => {
      const isHeading = line.startsWith("Answer:") || line.startsWith("Pros:") ||
                        line.startsWith("Cons:") || line.startsWith("Confidence:");
      return (
        <p key={i} className={isHeading ? "chat-answer-line-heading" : "chat-answer-line"}>
          {line}
        </p>
      );
    });
  };

  if (!product) return <Loader message="loading product..." />;

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">

        {/* product header */}
        <div className="chat-product-header">
          <button className="chat-back-btn" onClick={() => navigate("/dashboard")}>
            ← back to products
          </button>
          <h1 className="chat-product-title">{product.name}</h1>
          <p className="chat-product-subtitle">{product.brand} · {product.category}</p>
        </div>

        {/* tabs */}
        <div className="chat-tabs">
          {["chat", "reviews", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); if (tab === "reviews") fetchProductReviews(); }}
              className={`chat-tab-btn ${activeTab === tab ? "active" : "inactive"}`}
            >
              {tab === "chat" ? "💬 Ask AI" : tab === "reviews" ? "⭐ Reviews" : "🕓 History"}
            </button>
          ))}
        </div>

        {/* ── CHAT TAB ─────────────────────────────────────── */}
        {activeTab === "chat" && (
          <div>
            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <p className="chat-input-hint">ask anything about {product.name} based on real user reviews</p>
              <textarea
                rows={3}
                placeholder="e.g. how is the battery life? does it heat during gaming?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                className="chat-textarea"
              />
              {chatError && <p className="error-msg" style={{ marginBottom: "0.8rem" }}>{chatError}</p>}
              <button className="btn btn-primary" onClick={handleAskQuestion} disabled={chatLoading}>
                {chatLoading ? "analyzing reviews..." : "Ask AI ✨"}
              </button>
            </div>

            {chatLoading && <Loader message="gemini is analyzing reviews..." />}

            {currentAnswer && !chatLoading && (
              <div className={`card chat-answer-card`}>
                <h3 className="chat-answer-label">
                  AI Answer for: <span style={{ color: "var(--text)" }}>{currentAnswer.question}</span>
                </h3>
                <div className="chat-answer-body">{formatAnswer(currentAnswer.aiAnswer)}</div>

                {currentAnswer.supportingReviews?.length > 0 && (
                  <div>
                    <p className="supporting-reviews-label">
                      based on {currentAnswer.supportingReviews.length} reviews:
                    </p>
                    {currentAnswer.supportingReviews.map((r, i) => (
                      <div key={i} className="supporting-review-item">
                        <div className="supporting-review-top">
                          <span className="supporting-review-username">{r.username}</span>
                          <span className="supporting-review-stars">{"★".repeat(r.rating)}</span>
                        </div>
                        <p className="supporting-review-text">{r.review}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* ── REVIEWS TAB ──────────────────────────────────── */}
        {activeTab === "reviews" && (
          <div>
            <div className={`card review-form-card`}>
              <h3 style={{ marginBottom: "1rem" }}>write a review</h3>
              <div className="review-field">
                <label className="review-label">Rating</label>
                <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                  <option value={5}>⭐⭐⭐⭐⭐ — excellent</option>
                  <option value={4}>⭐⭐⭐⭐ — good</option>
                  <option value={3}>⭐⭐⭐ — average</option>
                  <option value={2}>⭐⭐ — poor</option>
                  <option value={1}>⭐ — terrible</option>
                </select>
              </div>
              <div className="review-field">
                <label className="review-label">Your Review</label>
                <textarea
                  rows={4}
                  placeholder="share your experience with this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  style={{ resize: "vertical" }}
                />
              </div>
              {reviewError && <p className="error-msg" style={{ marginBottom: "0.8rem" }}>{reviewError}</p>}
              {reviewSuccess && <p className="success-msg" style={{ marginBottom: "0.8rem" }}>{reviewSuccess}</p>}
              <button className="btn btn-primary" onClick={handleSubmitReview} disabled={reviewLoading}>
                {reviewLoading ? "submitting..." : "Submit Review"}
              </button>
            </div>

            {reviewsLoading && <Loader message="loading reviews..." />}
            {!reviewsLoading && productReviews.length === 0 && (
              <div className="card empty-state">no reviews yet, be the first to review</div>
            )}
            {productReviews.map((r) => (
              <div key={r._id} className="card review-card">
                <div className="review-card-top">
                  <span className="review-card-username">{r.username}</span>
                  <span className="review-card-stars">{"★".repeat(r.rating)}</span>
                </div>
                <p className="review-card-text">{r.review}</p>
                <p className="review-card-date">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── HISTORY TAB ──────────────────────────────────── */}
        {activeTab === "history" && (
          <div>
            {historyLoading && <Loader message="loading history..." />}
            {!historyLoading && history.length === 0 && (
              <div className="card empty-state">no chat history for this product yet</div>
            )}
            {history.map((chat) => (
              <div key={chat._id} className="card history-card">
                <div className="history-card-top">
                  <p className="history-question">Q: {chat.question}</p>
                  <button
                    className="btn btn-danger history-delete-btn"
                    onClick={() => handleDeleteChat(chat._id)}
                  >
                    delete
                  </button>
                </div>
                <div className="history-answer">{formatAnswer(chat.aiAnswer)}</div>
                <p className="history-date">{new Date(chat.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default ChatPage;