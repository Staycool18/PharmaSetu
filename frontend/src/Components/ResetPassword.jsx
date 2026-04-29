import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../Service/api";
import "./ForgetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setMessage("Invalid reset link");
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: password
      });
      setMessage("Password reset successful! You can now login.");
      setTimeout(() => navigate("/signup"), 2000);
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || "Failed to reset password"));
    }
    setLoading(false);
  };

  return (
    <div className="signup-page">
      <div className="signup-right">
        <div className="forget-password-container">
          <h2>🔐 Reset Password</h2>
          
          {message && (
            <div className={`message ${message.includes("Error") || message.includes("Invalid") ? "error" : "success"}`}>
              {message}
            </div>
          )}

          {token && !message.includes("successful") && (
            <form onSubmit={handleSubmit} className="forget-form">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
              
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
              />
              
              <button type="submit" disabled={loading}>
                {loading ? "🔄 Resetting..." : "✅ Reset Password"}
              </button>
            </form>
          )}

          <button onClick={() => navigate("/signup")} className="back-btn">
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;