import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Login() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    if (!studentId || !password) {
      alert("Please enter your Student ID and Password.");
      return;
    }
    localStorage.setItem("studentId", studentId);
    localStorage.setItem("studentName", "Daniel");
    navigate("/dashboard");
  };
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🎓</div>
        <h1>Welcome Back</h1>
        <p>Login to your student examination portal</p>
        <form onSubmit={handleLogin}>
          <label>Student ID</label>
          <input
            type="text"
            placeholder="Enter your Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="primary-button">
            Login
          </button>
        </form>
        <p className="login-demo">
          Demo: Enter any Student ID and Password
        </p>
      </div>
    </div>
  );
}
export default Login;