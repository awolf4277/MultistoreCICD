import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePublicKey = import.meta.env
  .VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

if (!stripePublicKey) {
  console.warn(
    "[Stripe] VITE_STRIPE_PUBLISHABLE_KEY is not set. Card input will not work."
  );
}

const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {stripePromise ? (
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    ) : (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020617",
          color: "#e5e7eb",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>
            Stripe not configured
          </h1>
          <p style={{ fontSize: 14, color: "#9ca3af" }}>
            Set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in your <code>.env</code>{" "}
            file and restart <code>npm run dev</code> to enable card input.
          </p>
        </div>
      </div>
    )}
  </React.StrictMode>
);


