import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Service/api";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert("Failed to fetch order history");
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="order-history-page">
      <div className="order-header">
        <button onClick={() => navigate("/pharmacies")} className="back-btn">
          ← Back to Pharmacies
        </button>
        <h1>📋 My Order History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-header-info">
                <h3>Order #{order.orderId}</h3>
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="order-details">
                <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                <p><strong>Payment ID:</strong> {order.paymentId || "N/A"}</p>
                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <span>{item.medicineName}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>₹{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;