import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const studentId = localStorage.getItem("studentId");

  if (!studentId) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;