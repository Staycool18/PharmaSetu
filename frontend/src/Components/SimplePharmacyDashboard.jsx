import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Service/api";
import "./PharmacyDashboard.css";

const SimplePharmacyDashboard = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [fdaLoading, setFdaLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [medicine, setMedicine] = useState({
    name: "",
    description: "",
    usage: "",
    warnings: "",
    sideEffects: "",
    price: "",
    quantity: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      // For now, get all medicines since we don't have pharmacy-specific endpoint working
      const response = await api.get("/medicine/all");
      setMedicines(response.data || []);
    } catch (err) {
      console.error("Error fetching medicines:", err);
      setMedicines([]);
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
        alert("Medicine information loaded!");
      }
    } catch (err) {
      alert("Using default values. You can edit as needed.");
    }
    setFdaLoading(false);
  };

  const deleteMedicine = async (medicineId, medicineName) => {
    if (!window.confirm(`Are you sure you want to delete ${medicineName}?`)) {
      return;
    }
    
    try {
      await api.delete(`/medicine/delete/${medicineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Medicine deleted successfully!");
      fetchMedicines();
    } catch (err) {
      console.error("Error deleting medicine:", err);
      alert("Failed to delete medicine");
    }
  };

  const validateForm = () => {
    if (!medicine.name.trim()) {
      setError("Medicine name is required");
      return false;
    }
    if (medicine.description && medicine.description.length > 500) {
      setError("Description must be less than 500 characters");
      return false;
    }
    if (medicine.usage && medicine.usage.length > 500) {
      setError("Usage must be less than 500 characters");
      return false;
    }
    if (medicine.warnings && medicine.warnings.length > 500) {
      setError("Warnings must be less than 500 characters");
      return false;
    }
    if (medicine.sideEffects && medicine.sideEffects.length > 500) {
      setError("Side effects must be less than 500 characters");
      return false;
    }
    if (medicine.price && (isNaN(medicine.price) || medicine.price <= 0)) {
      setError("Price must be a valid positive number");
      return false;
    }
    if (medicine.quantity && (isNaN(medicine.quantity) || medicine.quantity <= 0)) {
      setError("Quantity must be a valid positive number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!validateForm()) {
      return;
    }
    
    if (!token) {
      setError("Please login first");
      navigate("/signup");
      return;
    }
    
    try {
      const response = await api.post("/medicine/add", medicine, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSuccess("Medicine added successfully!");
      setMedicine({ name: "", description: "", usage: "", warnings: "", sideEffects: "", price: "", quantity: "" });
      setShowAddForm(false);
      fetchMedicines();
    } catch (err) {
      console.error("Error adding medicine:", err.response || err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/signup"), 2000);
      } else if (err.response?.status === 400) {
        setError("Invalid data. Please check all fields and try again.");
      } else if (err.response?.data?.includes("Data truncation")) {
        setError("One or more fields are too long. Please shorten your text.");
      } else {
        setError("Failed to add medicine. Please try again.");
      }
    }
  };

  return (
    <div className="pharmacy-dashboard">
      <div className="dashboard-header">
        <h1>🏪 My Pharmacy Dashboard</h1>
        <p>Add medicines to your inventory</p>
        <button onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }} className="logout-btn">
           Logout
        </button>
      </div>

      <div className="medicines-section">
        <div className="section-header">
          <h2>💊 My Medicines ({medicines.length})</h2>
          <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">
            {showAddForm ? "Cancel" : "➕ Add Medicine"}
          </button>
        </div>

        {showAddForm && (
          <div className="add-medicine-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  name="name"
                  placeholder="Medicine Name (e.g., Paracetamol)"
                  value={medicine.name}
                  onChange={handleChange}
                  required
                />
                <button type="button" onClick={fetchFromFDA} disabled={fdaLoading}>
                  {fdaLoading ? "🔄 Loading..." : "🔍 FDA Lookup"}
                </button>
              </div>

              <textarea
                name="description"
                placeholder="Description (max 500 characters)"
                value={medicine.description}
                onChange={handleChange}
                rows="2"
                maxLength="500"
              />

              <textarea
                name="usage"
                placeholder="Usage Instructions (max 500 characters)"
                value={medicine.usage}
                onChange={handleChange}
                rows="2"
                maxLength="500"
              />

              <textarea
                name="warnings"
                placeholder="Warnings (max 500 characters)"
                value={medicine.warnings}
                onChange={handleChange}
                rows="2"
                maxLength="500"
              />

              <textarea
                name="sideEffects"
                placeholder="Side Effects (max 500 characters)"
                value={medicine.sideEffects}
                onChange={handleChange}
                rows="2"
                maxLength="500"
              />

              <div className="input-group">
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="Price (₹)"
                  value={medicine.price}
                  onChange={handleChange}
                  required
                />
                <input
                  name="quantity"
                  type="number"
                  placeholder="Quantity"
                  value={medicine.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                 Add Medicine
              </button>
            </form>
          </div>
        )}

        {medicines.length > 0 ? (
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
                        className="delete-btn"
                        onClick={() => deleteMedicine(med.id, med.name)}
                      >
                         Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="info-card">
            <h3>📋 Instructions</h3>
            <p>1. Click "Add Medicine" to start</p>
            <p>2. Enter medicine name and click "FDA Lookup" for auto-fill</p>
            <p>3. Edit any fields as needed</p>
            <p>4. Click "Add Medicine" to save</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplePharmacyDashboard;