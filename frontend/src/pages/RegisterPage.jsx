// frontend/src/pages/RegisterPage.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authApi.js";
import Navbar from "../components/Navbar.jsx";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("please fill all fields");
      return;
    }
    if (password.length < 6) {
      setError("password must be atleast 6 charecters");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await registerUser(name, email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "registration failed, try again");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div>
      <Navbar />
      <div className="page-wrapper register-wrapper">
        <div className="card register-card">
          <h2 className="register-title">Create account</h2>
          <p className="register-subtitle">join and start exploring reviews</p>

          <div className="register-form">
            <div>
              <label className="register-label">Name</label>
              <input
                type="text"
                placeholder="your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <label className="register-label">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div>
              <label className="register-label">Password</label>
              <input
                type="password"
                placeholder="min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button
              className="btn btn-primary register-submit-btn"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "creating account..." : "Register"}
            </button>

            <p className="register-login-link">
              already have account?{" "}
              <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;