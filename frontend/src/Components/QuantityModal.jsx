import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Service/api";
import "./QuantityModal.css";

// Function for Buy Now with quantity
const handleDirectBuyNowWithQuantity = async (medicine, quantity, navigate) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/signup");
      return;
    }

    const orderResponse = await api.post(
      "/orders/create",
      {
        items: [
          {
            medicineId: medicine.id,
            quantity: quantity,
            price: medicine.price,
          },
        ],
        totalAmount: medicine.price * quantity,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const order = orderResponse.data;

    navigate("/checkout", { 
      state: { 
        items: [{ ...medicine, quantity }], 
        total: medicine.price * quantity,
        orderId: order.id
      }
    });
  } catch (error) {
    console.error("Order creation error:", error);
    alert("Failed to create order: " + error.message);
  }
};

const QuantityModal = ({ medicine, isOpen, onClose, onAddToCart, isBuyNow = false }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (isBuyNow) {
      handleDirectBuyNowWithQuantity(medicine, quantity, navigate);
    } else {
      onAddToCart(medicine, quantity);
    }
    setQuantity(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Add to Cart</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        
        <div className="modal-content">
          <div className="medicine-info">
            <h4>{medicine.name}</h4>
            <p>Price: ₹{medicine.price} per unit</p>
          </div>
          
          <div className="quantity-section">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>
          
          <div className="total-price">
            Total: ₹{(medicine.price * quantity).toFixed(2)}
          </div>
        </div>
        
        <div className="modal-actions">
          <button onClick={handleAddToCart} className="add-btn">
            {isBuyNow ? "Buy Now" : "Add to Cart"}
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityModal;