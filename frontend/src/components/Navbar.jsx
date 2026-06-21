// frontend/src/components/Navbar.jsx

import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // i clear everything from localStorage on logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const token = localStorage.getItem("token");

  return (
    <nav className="navbar">
      <span className="navbar-logo" onClick={() => navigate("/dashboard")}>
        🤖 ReviewBot
      </span>
      {token && (
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;