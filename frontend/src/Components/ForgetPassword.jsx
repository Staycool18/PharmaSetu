import React, { useState } from "react";
import api from "../Service/api";
import "./ForgetPassword.css";

const ForgetPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    
    if (!email.trim()) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }
    
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("Password reset email sent! Check your inbox.");
      setMessageType("success");
    } catch (err) {
      if (err.response?.status === 404) {
        setMessage("Email address not found. Please check and try again.");
      } else if (err.response?.status === 400) {
        setMessage("Invalid email format. Please enter a valid email.");
      } else {
        setMessage(err.response?.data?.message || "Failed to send reset email. Please try again.");
      }
      setMessageType("error");
    }
    setLoading(false);
  };

  return (
    <div className="forget-password-container">
      <h2>Reset Password</h2>
      
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="forget-form">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <button onClick={onBack} className="back-btn">
        ← Back to Login
      </button>
    </div>
  );
};

export default ForgetPassword;