// frontend/src/pages/LoginPage.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authApi.js";
import Navbar from "../components/Navbar.jsx";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("please fill all fields");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "login failed, try again");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div>
      <Navbar />
      <div className="page-wrapper login-wrapper">
        <div className="card login-card">
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">login to your account</p>

          <div className="login-form">
            <div>
              <label className="login-label">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <label className="login-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button
              className="btn btn-primary login-submit-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "logging in..." : "Login"}
            </button>

            <p className="login-register-link">
              dont have account?{" "}
              <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;