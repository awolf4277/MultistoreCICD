import React from "react";
import { products } from "./products";
import CheckoutForm from "./components/CheckoutForm";
import "./styles.css";

type StoreMode = "main" | "dev" | "sandbox";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface LastOrder {
  items: CartItem[];
  total: number;
}

const App: React.FC = () => {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [storeMode, setStoreMode] = React.useState<StoreMode>("main");
  const [lastOrder, setLastOrder] = React.useState<LastOrder | null>(null);
  const [motionEnabled, setMotionEnabled] = React.useState(true);

  // Wire Visual FX toggle into body for anti-seizure support
  React.useEffect(() => {
    document.body.dataset.motion = motionEnabled ? "default" : "reduced";
  }, [motionEnabled]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function storeModeLabel(mode: StoreMode): string {
    if (mode === "main") return "Main Store";
    if (mode === "dev") return "Dev Store";
    return "Sandbox";
  }

  function addToCart(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  const stripeCartItems = cart.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));

  function handleCheckoutSuccess() {
    setLastOrder({
      items: cart,
      total: cartTotal,
    });
    clearCart();
  }

  return (
    <div className="app-root">
      {/* Silver strobe background */}
      <div className="strobe-layer" aria-hidden="true" />

      {/* TOP DASHBOARD BAR */}
      <header className="status-bar">
        <div className="status-left">
          <div className="status-line-main">
            <span className="status-dot" />
            <span>
              SYSTEM STATUS: <strong>GREEN</strong> · All services operational
            </span>
          </div>
          <div className="status-line-sub">
            FRONT-END: <strong>FULLY OPERATIONAL</strong> · Local build · Your
            code
          </div>
        </div>
        <div className="status-right">
          <span>
            MODE: <strong>{storeModeLabel(storeMode)}</strong>
          </span>
          <span>
            Cart · <strong>{cartCount}</strong>
          </span>
        </div>
      </header>

      {/* HERO SECTION UNDER DASHBOARD */}
      <header className="hero">
        <div className="hero-left">
          <div className="hero-badge">I AM THE ONE</div>
          <h1 className="hero-title">Multi-Store Commerce Engine</h1>
          <p className="hero-subtitle">
            Catalog · Cart · Checkout
            <br />
            <span className="hero-subtitle-secondary">
              This build lives on your machine. No black boxes. No SDK magic.
              Every request is yours.
            </span>
          </p>

          <div className="hero-tags">
            <span className="pill">React</span>
            <span className="pill">Vite</span>
            <span className="pill">TypeScript</span>
            <span className="pill pill-outline">Stripe / PayPal Ready</span>
          </div>

          <div className="hero-metrics">
            <div className="metric-card">
              <span className="metric-label">Products Loaded</span>
              <span className="metric-value">{products.length}</span>
              <span className="metric-caption">Catalog in local memory</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Avg Price</span>
              <span className="metric-value">$125.39</span>
              <span className="metric-caption">Demo benchmark</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Cart Total</span>
              <span className="metric-value">
                ${cartTotal.toFixed(2)}
              </span>
              <span className="metric-caption">
                Live client calculation
              </span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          {/* Store mode toggle */}
          <div className="store-mode-toggle">
            <span className="toggle-label">Store Mode</span>
            <div className="toggle-buttons">
              <button
                className={`toggle-btn ${
                  storeMode === "main" ? "toggle-btn-active" : ""
                }`}
                onClick={() => setStoreMode("main")}
              >
                Main
              </button>
              <button
                className={`toggle-btn ${
                  storeMode === "dev" ? "toggle-btn-active" : ""
                }`}
                onClick={() => setStoreMode("dev")}
              >
                Dev
              </button>
              <button
                className={`toggle-btn ${
                  storeMode === "sandbox" ? "toggle-btn-active" : ""
                }`}
                onClick={() => setStoreMode("sandbox")}
              >
                Sandbox
              </button>
            </div>
            <p className="store-mode-caption">
              Same UI, different backend config once your envs are wired in.
            </p>
          </div>

          {/* Visual FX toggle */}
          <div className="motion-toggle">
            <div className="motion-header">
              <span className="toggle-label">Visual FX</span>
              <span className="motion-status">
                {motionEnabled ? "Enhanced" : "Reduced"}
              </span>
            </div>
            <p className="motion-description">
              Anti-seizure safeguard: turn off strobe / aggressive motion if
              you are sensitive to flashing visuals.
            </p>
            <button
              className="motion-switch"
              onClick={() => setMotionEnabled((v) => !v)}
              type="button"
            >
              <span
                className={`motion-switch-thumb ${
                  motionEnabled ? "on" : "off"
                }`}
              />
              <span className="motion-switch-label">
                {motionEnabled ? "Disable intense FX" : "Enable intense FX"}
              </span>
            </button>
          </div>

          {/* Cart summary */}
          <div className="hero-cart-summary">
            <div className="cart-summary-row">
              <span>Items in cart</span>
              <span>{cartCount}</span>
            </div>
            <div className="cart-summary-row">
              <span>Cart total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <p className="cart-summary-caption">
              On submit, your frontend posts JSON to{" "}
              <code>/api/checkout</code>. Your backend decides how to charge,
              log, and fulfill.
            </p>
          </div>
        </div>
      </header>

      {/* MAIN GRID: CATALOG + CHECKOUT */}
      <main className="main-layout">
        {/* Catalog */}
        <section className="catalog">
          <header className="catalog-header">
            <div>
              <h2>I Am The One · Products</h2>
              <p>
                Click <strong>“Add to cart”</strong> to build an order and run
                the full checkout pipeline.
              </p>
            </div>
          </header>

          <div className="product-grid">
            {products.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-image-shell">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="product-image-placeholder">
                      <span className="product-image-text">
                        {product.category}
                      </span>
                    </div>
                  )}
                </div>
                <div className="product-body">
                  <div className="product-meta">
                    <span className="product-category">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">
                    {product.description}
                  </p>
                  <div className="product-footer">
                    <span className="product-price">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product.id)}
                      type="button"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Checkout panel */}
        <aside className="checkout-panel">
          <div className="checkout-panel-inner">
            <h2>Cart · Checkout</h2>
            {cart.length === 0 ? (
              <p className="cart-empty">
                Your cart is empty. Add a 4K monitor, mechanical keyboard,
                whatever turns you into the operator.
              </p>
            ) : (
              <ul className="cart-list">
                {cart.map((item) => (
                  <li key={item.id} className="cart-item">
                    <div>
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-meta">
                        {item.quantity} × ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="cart-total-row">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <div className="checkout-form-shell">
              <h3>Checkout Details (Stripe Test Mode)</h3>
              <p className="checkout-caption">
                Card entry is simulated in this demo. The backend still creates
                a Stripe PaymentIntent in test mode.
              </p>
              <CheckoutForm
                cartItems={stripeCartItems}
                cartTotal={cartTotal}
                onSuccess={handleCheckoutSuccess}
              />
            </div>

            {lastOrder && (
              <div className="last-order-panel">
                <h3>Last Order</h3>
                <p>
                  <strong>Total:</strong> ${lastOrder.total.toFixed(2)}
                </p>
                <ul>
                  {lastOrder.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity} × {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <footer className="legal-footer">
              <p>
                © {new Date().getFullYear()} Andrew Wolverton · I Am The One ·
                Multi-Store Commerce Engine. All rights reserved.
              </p>
              <p className="legal-disclaimer">
                Visual disclaimer: This build can use animated gradients and
                subtle strobe-style highlights. Use the{" "}
                <strong>Visual FX</strong> toggle above to reduce motion if you
                are prone to seizures or discomfort from flashing images.
              </p>
            </footer>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;
