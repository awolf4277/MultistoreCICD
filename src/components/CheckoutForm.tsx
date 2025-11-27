// src/components/CheckoutForm.tsx
import React from "react";

type CartItemInput = {
  id: string;
  quantity: number;
};

interface CheckoutFormProps {
  cartItems: CartItemInput[];
  onSuccess: () => void;
}

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartItems, onSuccess }) => {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  if (!stripeKey) {
    return (
      <div className="checkout-panel">
        <div className="checkout-message">
          Stripe is not configured.{" "}
          Set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in your <code>.env</code>{" "}
          and restart <code>npm run dev</code>.
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!cartItems.length) {
      setErrorMessage("Cart is empty.");
      return;
    }

    try {
      setStatus("submitting");

      const res = await fetch(
        `${backendUrl}/api/checkout/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            customer: {
              name: "Demo User",
              email: "demo@example.com",
            },
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          (data && (data.error as string)) ||
          "Checkout request failed. Please try again.";
        throw new Error(msg);
      }

      // At this point backend + Stripe succeeded.
      // We don't care what the shape of `data` is anymore – treat it as success.
      console.log("PaymentIntent response from backend:", data);
      onSuccess();
      setStatus("idle");
    } catch (err: any) {
      console.error("Checkout error:", err);
      setStatus("error");
      setErrorMessage(err?.message || "Payment failed. Please try again.");
    }
  }

  return (
    <div className="checkout-panel">
      <form onSubmit={handleSubmit}>
        <div
          style={{
            marginBottom: 8,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Checkout Details (Stripe Test Mode)
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontSize: 12,
          }}
        >
          <input
            type="text"
            placeholder="Name"
            defaultValue="Demo User"
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.7)",
              background: "rgba(15,23,42,0.9)",
              color: "#e5e7eb",
            }}
          />
          <input
            type="email"
            placeholder="Email"
            defaultValue="demo@example.com"
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.7)",
              background: "rgba(15,23,42,0.9)",
              color: "#e5e7eb",
            }}
          />
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px dashed rgba(148,163,184,0.7)",
              background: "rgba(15,23,42,0.7)",
              fontSize: 11,
              color: "#9ca3af",
            }}
          >
            Card entry is simulated in this demo.
            The backend still creates a Stripe PaymentIntent in test mode.
          </div>
          <button
            type="submit"
            disabled={status === "submitting"}
            style={{
              marginTop: 6,
              padding: "8px 14px",
              borderRadius: 999,
              border: "none",
              background: "linear-gradient(135deg, #22c55e, #4ade80)",
              color: "#022c22",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {status === "submitting" ? "Processing..." : "Pay Now"}
          </button>
        </div>

        {errorMessage && (
          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: "#fecaca",
            }}
          >
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
