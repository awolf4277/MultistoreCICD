// src/pages/CheckoutPage.tsx
import React from "react";
import CheckoutForm from "../components/CheckoutForm";

const CheckoutPage: React.FC = () => {
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <main className="checkout-page">
      <h1>Checkout</h1>

      <CheckoutForm
        cartItems={[]}        // empty demo cart
        cartTotal={0}         // $0.00 total so TS is happy
        onSuccess={() => setSubmitted(true)}
      />

      {submitted && (
        <p style={{ marginTop: 12, fontSize: 13 }}>
          Demo checkout complete.
        </p>
      )}
    </main>
  );
};

export default CheckoutPage;
