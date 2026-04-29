import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../Service/api";
import MockPaymentGateway from "./MockPaymentGateway";
import "./Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  useEffect(() => {
    if (!location.state) {
      navigate("/pharmacies");
      return;
    }
    setOrderData(location.state);
  }, [location, navigate]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Create order in backend first
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        navigate("/signup");
        return;
      }

      const orderResponse = await api.post(
        "/orders/create",
        {
          items: orderData.items.map((item) => ({
            medicineId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: orderData.total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = orderResponse.data;
      setOrderData({...orderData, orderId: order.id});
      setShowPaymentGateway(true);
    } catch (error) {
      console.error("Order creation error:", error);
      alert("Failed to create order: " + error.message);
    }
    setLoading(false);
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      const token = localStorage.getItem("token");
      const verifyResponse = await api.post(
        "/orders/verify-payment",
        {
          paymentId: paymentResponse.razorpay_payment_id,
          orderId: paymentResponse.razorpay_order_id,
          signature: paymentResponse.razorpay_signature,
          orderEntityId: orderData.orderId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (verifyResponse.status >= 200 && verifyResponse.status < 300) {
        localStorage.removeItem("cart");
        navigate("/pharmacies", { 
          state: { 
            message: "Order placed successfully!",
            paymentId: paymentResponse.razorpay_payment_id,
            transactionId: paymentResponse.transaction_id
          }
        });
      } else {
        alert("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      alert("Payment verification failed");
    }
  };

  const handleBuyNow = async (medicine) => {
    setLoading(true);
    
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load");
      setLoading(false);
      return;
    }

    const options = {
      key: "rzp_test_9WaeLLXtGiUBHn", // Replace with your Razorpay key
      amount: medicine.price * 100, // Amount in paise
      currency: "INR",
      name: "PharmaSetu",
      description: `${medicine.name} - Quick Purchase`,
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        navigate("/pharmacies", { 
          state: { 
            message: "Order placed successfully!",
            paymentId: response.razorpay_payment_id 
          }
        });
      },
      prefill: {
        name: "Customer",
        email: "customer@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#e50914"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  if (!orderData) return <div>Loading...</div>;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h2>🛒 Checkout</h2>
        
        <div className="order-summary">
          <h3>Order Summary</h3>
          {orderData.items.map(item => (
            <div key={item.id} className="checkout-item">
              <span>{item.name}</span>
              <span>{item.quantity} × ₹{item.price}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="checkout-total">
            <strong>Total: ₹{orderData.total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="payment-section">
          <button 
            onClick={handlePayment} 
            disabled={loading}
            className="pay-btn"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
          <button 
            onClick={() => navigate("/pharmacies")} 
            className="back-btn"
          >
            Back to Shopping
          </button>
        </div>
      </div>
      
      <MockPaymentGateway
        isOpen={showPaymentGateway}
        orderData={orderData}
        onSuccess={handlePaymentSuccess}
        onClose={() => setShowPaymentGateway(false)}
      />
    </div>
  );
};

// Export the handleBuyNow function for direct use
export const handleDirectBuyNow = async (medicine, navigate) => {
  try {
    // Create single item order
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
            quantity: 1,
            price: medicine.price,
          },
        ],
        totalAmount: medicine.price,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const order = orderResponse.data;

    // Navigate to checkout with single item
    navigate("/checkout", { 
      state: { 
        items: [{ ...medicine, quantity: 1 }], 
        total: medicine.price,
        orderId: order.id
      }
    });
  } catch (error) {
    console.error("Order creation error:", error);
    alert("Failed to create order: " + error.message);
  }
};

export default Checkout;