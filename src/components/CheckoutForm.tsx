// src/components/CheckoutForm.tsx
import React from "react";

interface StripeCartItem {
  id: string;
  quantity: number;
}

interface CheckoutFormProps {
  cartItems: StripeCartItem[];
  cartTotal: number; // in dollars
  onSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cartItems,
  cartTotal,
  onSuccess,
}) => {
  const [name, setName] = React.useState("My App");
  const [email, setEmail] = React.useState("awolf4277@gmail.com");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">(
    "idle"
  );

  const cartEmpty = cartItems.length === 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (cartEmpty) {
      // Nothing to do if there are no items
      return;
    }

    // 🔥 DEMO MODE: simulate a successful payment, no backend
    setStatus("loading");

    setTimeout(() => {
      setStatus("success");
      onSuccess(); // this triggers your toast + order modal in App.tsx
    }, 800);
  }

  return (
    <div className="checkout-form">
      <h2>Checkout</h2>

      <p>
        Order total: <strong>${cartTotal.toFixed(2)}</strong>
      </p>

      <form onSubmit={handleSubmit} className="checkout-form__form">
        <div className="checkout-form__field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="checkout-form__field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={status === "loading" || cartEmpty}>
          {status === "loading" ? "Processing…" : "Pay Now"}
        </button>

        {status === "success" && (
          <p className="checkout-form__success">
            Payment recorded in demo mode.
          </p>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;


