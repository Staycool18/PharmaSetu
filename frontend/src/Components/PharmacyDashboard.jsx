import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Service/api";
import Cart from "./Cart";
import QuantityModal from "./QuantityModal";
import { handleDirectBuyNow } from "./Checkout";
import "./PharmacyDashboard.css";

const PharmacyDashboard = () => {
  const { pharmacyId } = useParams();
  const navigate = useNavigate();
  const [pharmacy, setPharmacy] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [fdaLoading, setFdaLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantityModal, setQuantityModal] = useState({ isOpen: false, medicine: null });
  const [cartCount, setCartCount] = useState(0);
  const [medicine, setMedicine] = useState({
    name: "",
    description: "",
    usage: "",
    warnings: "",
    sideEffects: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPharmacy();
    fetchMedicines();
    updateCartCount();
  }, [pharmacyId]);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  };

  const fetchPharmacy = async () => {
    try {
      const response = await api.get(`/pharmacy/${pharmacyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPharmacy(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await api.get(`/medicine/pharmacy/${pharmacyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setMedicine({ ...medicine, [e.target.name]: e.target.value });
  };

  const fetchFromFDA = async () => {
    if (!medicine.name) return;
    setFdaLoading(true);
    try {
      const response = await api.get(`/medicine/fetch/${encodeURIComponent(medicine.name)}`);
      if (response.data) {
        setMedicine({
          ...medicine,
          description: response.data.description || "",
          usage: response.data.usage || "",
          warnings: response.data.warnings || ""
        });
        alert("Medicine information loaded from database!");
      }
    } catch (err) {
      console.error("FDA lookup error:", err);
      alert("Medicine information loaded with default values. You can edit as needed.");
    }
    setFdaLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      alert("Please login first to add medicines");
      navigate("/signup");
      return;
    }
    
    try {
      await api.post("/medicine/add", medicine, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Medicine added successfully!");
      setMedicine({ name: "", description: "", usage: "", warnings: "", sideEffects: "" });
      setShowAddForm(false);
      fetchMedicines();
    } catch (err) {
      console.error("Error adding medicine:", err.response || err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Authentication failed. Please login again.");
        localStorage.removeItem("token");
        navigate("/signup");
      } else {
        alert("Failed to add medicine: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleAddToCart = (medicine, quantity) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(item => item.id === medicine.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...medicine, quantity });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    
    const goToCart = window.confirm(`Added ${medicine.name} to cart! Go to cart or continue shopping?`);
    if (goToCart) {
      setIsCartOpen(true);
    }
  };

  const handleBuyNow = (medicine) => {
    setQuantityModal({ isOpen: true, medicine, isBuyNow: true });
  };

  if (!pharmacy) return <div>Loading...</div>;
  
  // Debug info
  console.log("Current token:", token);
  console.log("Pharmacy ID:", pharmacyId);

  return (
    <div className="pharmacy-dashboard">
      <div className="dashboard-header">
        <button onClick={() => navigate("/pharmacies")} className="back-btn">
          ← Back to Pharmacies
        </button>
        <button onClick={() => setIsCartOpen(true)} className="cart-btn">
          🛒 Cart ({cartCount})
        </button>
        <h1>{pharmacy.pharmacyName}</h1>
      </div>

      <div className="medicines-section">
        <div className="section-header">
          <h2>💊 Medicines ({medicines.length})</h2>
        </div>



        <div className="medicines-grid">
          {medicines.map((med) => (
            <div key={med.id} className="medicine-card">
              <div className="medicine-icon">💊</div>
              <div className="medicine-info">
                <h3 className="medicine-name">{med.name}</h3>
                <div className="medicine-details">
                  <div className="detail-section">
                    <strong>Description:</strong>
                    <p>{med.description || 'No description available'}</p>
                  </div>
                  <div className="detail-section">
                    <strong>Usage:</strong>
                    <p>{med.usage || 'Consult your doctor'}</p>
                  </div>
                  <div className="detail-section">
                    <strong>Warnings:</strong>
                    <p>{med.warnings || 'Read package insert'}</p>
                  </div>
                  {med.sideEffects && (
                    <div className="detail-section">
                      <strong>Side Effects:</strong>
                      <p>{med.sideEffects}</p>
                    </div>
                  )}
                  <div className="medicine-actions">
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => setQuantityModal({ isOpen: true, medicine: med })}
                    >
                      🛒 Add to Cart
                    </button>
                    <button 
                      className="buy-now-btn"
                      onClick={() => handleBuyNow(med)}
                    >
                       Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => {
          setIsCartOpen(false);
          updateCartCount();
        }} 
      />
      
      <QuantityModal
        medicine={quantityModal.medicine}
        isOpen={quantityModal.isOpen}
        isBuyNow={quantityModal.isBuyNow}
        onClose={() => setQuantityModal({ isOpen: false, medicine: null, isBuyNow: false })}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default PharmacyDashboard;