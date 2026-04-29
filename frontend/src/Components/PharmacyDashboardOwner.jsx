import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Service/api";
import "./PharmacyDashboard.css";

const PharmacyDashboardOwner = () => {
  const navigate = useNavigate();
  const [pharmacy, setPharmacy] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [fdaLoading, setFdaLoading] = useState(false);
  const [medicine, setMedicine] = useState({
    name: "",
    description: "",
    usage: "",
    warnings: "",
    sideEffects: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyPharmacy();
  }, []);

  const fetchMyPharmacy = async () => {
    try {
      // For now, set a default pharmacy to avoid loading issues
      setPharmacy({
        id: 1,
        pharmacyName: "My Pharmacy",
        email: "pharmacy@example.com"
      });
      fetchMedicines(1); // Use pharmacy ID 1 for now
    } catch (err) {
      console.error("Error:", err);
      setPharmacy({ needsCreation: true });
    }
  };

  const fetchMedicines = async (pharmacyId) => {
    try {
      const response = await api.get(`/medicine/pharmacy/${pharmacyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicines(response.data || []);
    } catch (err) {
      console.error("Error fetching medicines:", err);
      setMedicines([]); // Set empty array if error
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
      console.error("FDA lookup error:", err);
      alert("Using default values. You can edit as needed.");
    }
    setFdaLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      alert("Please login first");
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
      if (pharmacy?.id) {
        fetchMedicines(pharmacy.id);
      }
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

  if (!pharmacy) return <div>Loading...</div>;

  if (pharmacy.needsCreation) {
    return (
      <div className="pharmacy-dashboard">
        <div className="dashboard-header">
          <h1>🏪 Create Your Pharmacy</h1>
          <p>You need to register your pharmacy first</p>
          <button onClick={() => navigate("/pharmacy/register")} className="add-btn">
             Register Pharmacy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pharmacy-dashboard">
      <div className="dashboard-header">
        <h1>🏪 {pharmacy.pharmacyName}</h1>
        <p> {pharmacy.email}</p>
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
          <div className="header-buttons">
            <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">
              {showAddForm ? "Cancel" : "➕ Add Medicine"}
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="add-medicine-form">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  name="name"
                  placeholder="Medicine Name"
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
                placeholder="Description"
                value={medicine.description}
                onChange={handleChange}
                rows="2"
              />

              <textarea
                name="usage"
                placeholder="Usage Instructions"
                value={medicine.usage}
                onChange={handleChange}
                rows="2"
              />

              <textarea
                name="warnings"
                placeholder="Warnings"
                value={medicine.warnings}
                onChange={handleChange}
                rows="2"
              />

              <textarea
                name="sideEffects"
                placeholder="Side Effects"
                value={medicine.sideEffects}
                onChange={handleChange}
                rows="2"
              />

              <button type="submit" className="submit-btn">
                 Add Medicine
              </button>
            </form>
          </div>
        )}

        <div className="medicines-grid">
          {medicines.map((med) => (
            <div key={med.id} className="medicine-card">
              <h3>{med.name}</h3>
              <p><strong>Description:</strong> {med.description}</p>
              <p><strong>Usage:</strong> {med.usage}</p>
              <p><strong>Warnings:</strong> {med.warnings}</p>
              {med.sideEffects && <p><strong>Side Effects:</strong> {med.sideEffects}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboardOwner;