// frontend/src/components/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";

// i check localStorage for token here
// if token exists, render the child page
// if not, send user to login
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;