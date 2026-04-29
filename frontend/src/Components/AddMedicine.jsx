import React, { useState } from "react";
import api from "../Service/api";
import "./AddMedicine.css";

const AddMedicine = () => {
  const [medicine, setMedicine] = useState({
    name: "",
    description: "",
    usage: "",
    warnings: "",
    sideEffects: ""
  });
  const [fdaData, setFdaData] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setMedicine({ ...medicine, [e.target.name]: e.target.value });
  };

  const fetchFromFDA = async () => {
    if (!medicine.name) return;
    setLoading(true);
    try {
      const response = await api.get(`/medicine/fetch/${encodeURIComponent(medicine.name)}`);
      setFdaData(response.data);
      setMedicine({
        ...medicine,
        description: response.data.description || "",
        usage: response.data.usage || "",
        warnings: response.data.warnings || ""
      });
    } catch (err) {
      alert("No FDA data found for this medicine");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/medicine/add", medicine, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Medicine added successfully!");
      setMedicine({
        name: "",
        description: "",
        usage: "",
        warnings: "",
        sideEffects: ""
      });
      setFdaData(null);
    } catch (err) {
      alert("Failed to add medicine");
    }
  };

  return (
    <div className="add-medicine-page">
      <div className="add-medicine-container">
        <h2>💊 Add New Medicine</h2>
        
        <form onSubmit={handleSubmit} className="medicine-form">
          <div className="input-group">
            <input
              name="name"
              placeholder="Medicine Name"
              value={medicine.name}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={fetchFromFDA} disabled={loading}>
              {loading ? "🔄" : "🔍"} FDA Lookup
            </button>
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={medicine.description}
            onChange={handleChange}
            rows="3"
          />

          <textarea
            name="usage"
            placeholder="Usage Instructions"
            value={medicine.usage}
            onChange={handleChange}
            rows="3"
          />

          <textarea
            name="warnings"
            placeholder="Warnings"
            value={medicine.warnings}
            onChange={handleChange}
            rows="3"
          />

          <textarea
            name="sideEffects"
            placeholder="Side Effects"
            value={medicine.sideEffects}
            onChange={handleChange}
            rows="3"
          />

          <button type="submit" className="submit-btn">
            ✅ Add Medicine
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;