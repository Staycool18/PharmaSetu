import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Service/api";
import "../Authenticate/SignupUser.css";

const RegisterPharmacy = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    pharmacyName: "",
    email: "",
    licenseNumber: "",
    password: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    await api.post(
      "/pharmacy/create",
      {
        pharmacyName: data.pharmacyName,
        email: data.email,
        licenseNumber: Number(data.licenseNumber),
        password: data.password
      }
    );
    alert("Pharmacy registered successfully!");
    navigate("/pharmacy/login"); // redirect to pharmacy login
  } catch (err) {
    console.error(err);
    alert("Failed to register pharmacy.");
  }
};

  return (
    <div className="signup-page">
      <div className="signup-image">
        <div className="brand-content">
          <h1>PharmaSetu</h1>
          <p>Join our network of trusted pharmacies. Expand your reach, serve more customers, and grow your business with our advanced pharmacy management platform.</p>
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-container">
          <h2>Register Your Pharmacy</h2>
          <form onSubmit={handleRegister} className="signup-form">
            <input
              name="pharmacyName"
              placeholder="Pharmacy Name"
              value={data.pharmacyName}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
              required
            />
            <input
              name="licenseNumber"
              placeholder="License Number"
              type="number"
              value={data.licenseNumber}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              placeholder="Password"
              type="password"
              value={data.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Register Pharmacy</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPharmacy;
