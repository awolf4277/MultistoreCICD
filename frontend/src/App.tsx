// src/App.tsx
import React from "react";
import "./index.css";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
};

type CartItem = Product & { quantity: number };

const products: Product[] = [
  {
    id: "monitor-4k",
    name: "4K Gaming Monitor",
    price: 499.99,
    category: "Displays",
    description: "Ultra-sharp 4K panel, 144Hz, built for high-FPS domination.",
  },
  {
    id: "keyboard-mech",
    name: "Mechanical Keyboard Pro",
    price: 149.0,
    category: "Input",
    description: "Hot-swap switches, per-key lighting, zero compromise.",
  },
  {
    id: "mouse-wireless",
    name: "Precision Wireless Mouse",
    price: 89.99,
    category: "Input",
    description: "Lag-free, multi-device, tuned for pixel-perfect flicks.",
  },
  {
    id: "headset-surround",
    name: "7.1 Surround Headset",
    price: 129.99,
    category: "Audio",
    description: "Directional audio you can feel. Hear everything.",
  },
];

const App: React.FC = () => {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [storeMode, setStoreMode] = React.useState<"main" | "dev" | "sandbox">(
    "main"
  );
  const [lastOrderTotal, setLastOrderTotal] = React.useState<number | null>(
    null
  );

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(id: string, quantity: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function handleFakeCheckout() {
    if (!cart.length) return;
    setLastOrderTotal(cartTotal);
    setCart([]);
    alert("Order captured locally. Backend wiring comes next.");
  }

  return (
    <div className="app-root">
      {/* HERO / HEADER */}
      <header className="hero">
        <div className="hero-left">
          <div className="eyebrow">I AM THE ONE</div>
          <h1 className="hero-title">
            Multi-Store Commerce Engine
            <span className="hero-gradient"> · Local Build</span>
          </h1>
          <p className="hero-subtitle">
            Catalog • Cart • Checkout. This build lives on your machine. No
            black boxes, no SDK magic — every request is yours.
          </p>

          <div className="hero-badges">
            <span className="badge badge-soft">React · Vite · TypeScript</span>
            <span className="badge badge-soft">Local Dev Environment</span>
            <span className="badge badge-soft">
              You are not a user. You are the one.
            </span>
          </div>
        </div>

        <div className="hero-right">
          <div className="metric-card">
            <div className="metric-label">Products</div>
            <div className="metric-value">{products.length}</div>
            <div className="metric-caption">Loaded into this build</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Cart Total</div>
            <div className="metric-value">${cartTotal.toFixed(2)}</div>
            <div className="metric-caption">Live client calculation</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Store Mode</div>
            <div className="metric-value">
              {storeMode === "main"
                ? "Main Store"
                : storeMode === "dev"
                ? "Dev Sandbox"
                : "Experimental"}
            </div>
            <div className="metric-caption">Swap config instantly</div>
          </div>
        </div>
      </header>

      {/* STORE MODE TOGGLE */}
      <section className="store-toggle">
        <div className="toggle-group">
          <button
            className={`toggle-button ${
              storeMode === "main" ? "active" : ""
            }`}
            onClick={() => setStoreMode("main")}
          >
            Main
          </button>
          <button
            className={`toggle-button ${storeMode === "dev" ? "active" : ""}`}
            onClick={() => setStoreMode("dev")}
          >
            Dev
          </button>
          <button
            className={`toggle-button ${
              storeMode === "sandbox" ? "active" : ""
            }`}
            onClick={() => setStoreMode("sandbox")}
          >
            Sandbox
          </button>
        </div>
        <p className="store-note">
          <strong>
            {storeMode === "main"
              ? "Main Store"
              : storeMode === "dev"
              ? "Dev Sandbox"
              : "Experimental"}
          </strong>{" "}
          · Same UI, different backend config once we wire multiple envs.
        </p>
      </section>

      {/* MAIN LAYOUT */}
      <main className="layout">
        {/* CATALOG */}
        <section className="panel panel-left">
          <div className="panel-header">
            <h2>Catalog</h2>
            <p>Click “Add to cart” to generate a live order.</p>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <article key={product.id} className="product-card">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-category">{product.category}</div>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    className="btn-primary"
                    onClick={() => addToCart(product)}
                  >
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CART */}
        <section className="panel panel-right">
          <div className="panel-header">
            <h2>Cart & Checkout</h2>
            <p>Cart total is calculated on the client.</p>
          </div>

          <div className="cart-section">
            {cart.length === 0 ? (
              <p className="cart-empty">Your cart is empty. Add a product.</p>
            ) : (
              <ul className="cart-list">
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div className="cart-main">
                      <div className="cart-title">{item.name}</div>
                      <div className="cart-meta">
                        <span>${item.price.toFixed(2)}</span>
                        <span>x {item.quantity}</span>
                        <span className="cart-subtotal">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="cart-actions">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.id,
                            Number(e.target.value || 1)
                          )
                        }
                      />
                      <button
                        className="btn-ghost"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="cart-summary">
              <div className="cart-total-row">
                <span>Total</span>
                <span className="cart-total-amount">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <button
              className="btn-primary"
              disabled={cart.length === 0}
              onClick={handleFakeCheckout}
            >
              Checkout (demo)
            </button>
            {lastOrderTotal !== null && (
              <p className="checkout-note">
                Last captured order total: ${lastOrderTotal.toFixed(2)}
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>I AM THE ONE · Local Build</span>
        <span>Frontend: React · Vite · TS</span>
      </footer>
    </div>
  );
};

export default App;


