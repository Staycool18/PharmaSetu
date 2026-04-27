import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "./Card";
import "./PharmacyList.css";

const PharmacyList = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    // 1️⃣ Get user's current location
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // 2️⃣ Call Spring Boot backend with location
          const response = await axios.get(
            "http://localhost:8080/api/pharmacies/nearby",
            {
              params: {
                lat,
                lon,
                radius: 5
              },
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          setPharmacies(response.data);
        } catch (error) {
          console.error(error);
          alert("Error fetching nearby pharmacies");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        alert("Location permission denied");
        setLoading(false);
      }
    );
  }, [token]);

  const goToRegister = () => {
    navigate("/pharmacy/register");
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>📍 Finding nearby pharmacies...</h2>;
  }

  return (
    <div className="pharmacies-page">
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        Logout
      </button>

      <div className="pharmacies-header">
        <h1>🏪 Nearby Pharmacies</h1>
        <div className="header-buttons">
          <button
            onClick={() => navigate("/order-history")}
            className="history-btn"
          >
            📋 Order History
          </button>

          <button onClick={goToRegister}>
            ➕ Register Your Pharmacy
          </button>
        </div>
      </div>

      <div className="pharmacies-grid">
        {pharmacies.length === 0 ? (
          <p>No pharmacies found near your location.</p>
        ) : (
          pharmacies.map((pharmacy, index) => (
            <Card
              key={index}
              name={pharmacy.pharmacyName}
              address={pharmacy.address || "N/A"}
              distance={`${pharmacy.distance.toFixed(2)} km`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PharmacyList;
