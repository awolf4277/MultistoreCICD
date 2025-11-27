// src/pages/CheckoutPage.tsx
import React from "react";
import CheckoutForm from "../components/CheckoutForm";

const CheckoutPage: React.FC = () => {
  const cartItems = [
    { id: "prod_4k_gaming_monitor", quantity: 1 },
    { id: "prod_mechanical_keyboard", quantity: 2 },
  ];

  const handleSuccess = () => {
    console.log("Payment success – clear cart and redirect to thank-you page.");
  };

  return (
    <div className="checkout-page">
      <div className="checkout-summary">
        <h2>Order Summary</h2>
        <ul>
          <li>4K Gaming Monitor x 1</li>
          <li>Mechanical Keyboard x 2</li>
        </ul>
        <p>Total will be calculated on the backend (Stripe amount: $859.97).</p>
      </div>
      <div className="checkout-payment">
        <CheckoutForm cartItems={cartItems} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default CheckoutPage;
