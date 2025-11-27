import React from "react";
import { products } from "./products";
import CheckoutForm from "./components/CheckoutForm";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type StoreMode = "main" | "dev" | "sandbox";

interface LastOrder {
  items: CartItem[];
  total: number;
}

const App: React.FC = () => {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [store, setStore] = React.useState<StoreMode>("main");
  const [lastOrder, setLastOrder] = React.useState<LastOrder | null>(null);
  const [showOrderModal, setShowOrderModal] = React.useState(false);
  const [toast, setToast] = React.useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });

  const productCount = products.length;
  const avgPrice =
    products.reduce((sum, p) => sum + p.price, 0) / Math.max(productCount, 1);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  function showToast(message: string) {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast((current) =>
        current.message === message ? { ...current, visible: false } : current
      );
    }, 2600);
  }

  function addToCart(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCart((current) => {
      const existing = current.find((c) => c.id === product.id);
      let next: CartItem[];
      if (existing) {
        next = current.map((c) =>
          c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        next = [
          ...current,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ];
      }
      return next;
    });

    showToast(`${product.name} added to cart`);
  }

  function removeFromCart(productId: string) {
    setCart((current) => current.filter((c) => c.id !== productId));
  }

  function handleCheckoutSuccess() {
    if (!cart.length) return;

    // Snapshot the current cart + total before clearing it
    const snapshotItems = [...cart];
    const snapshotTotal = snapshotItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setLastOrder({
      items: snapshotItems,
      total: snapshotTotal,
    });
    setCart([]);
    setShowOrderModal(true);
    showToast("Payment successful! Order ready.");
  }

  // What we send to Stripe backend: id + quantity only
  const stripeCartItems = cart.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));

  const storeLabel =
    store === "main" ? "Main Store" : store === "dev" ? "Dev Store" : "Sandbox";

  return (
    <div className={`app-shell store-${store}`}>
      {/* SYSTEM STATUS STRIP */}
      <div className="status-strip">
        <span className="status-indicator" />
        <span className="status-text">
          SYSTEM STATUS: <strong>GREEN</strong> · All services operational
        </span>
        <span className="status-env">MODE: {storeLabel}</span>
      </div>

      {/* HEADER */}
      <header className="app-header">
        <div className="brand-lockup">
          <div className="brand-mark">1</div>
          <div>
            <div className="brand-title">I AM THE ONE</div>
            <div className="brand-sub">Multi-Store Commerce Engine</div>
          </div>
        </div>
        <nav className="app-nav">
          <span>Catalog · Cart · Checkout</span>

          <div className="cart-badge">
            <span className="cart-dot" />
            Cart · {cartQuantity}
          </div>

          <div className="store-switcher">
            <span className="store-switcher-label">Store:</span>
            <div className="store-switcher-buttons">
              <button
                type="button"
                className={store === "main" ? "active" : ""}
                onClick={() => setStore("main")}
              >
                Main
              </button>
              <button
                type="button"
                className={store === "dev" ? "active" : ""}
                onClick={() => setStore("dev")}
              >
                Dev
              </button>
              <button
                type="button"
                className={store === "sandbox" ? "active" : ""}
                onClick={() => setStore("sandbox")}
              >
                Sandbox
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="app-main">
        {/* HERO */}
        <section className="hero">
          <div>
            <div className="hero-tag">
              <span className="hero-tag-dot" />
              FRONT-END · FULLY OPERATIONAL
            </div>
            <h1 className="hero-title">
              You&apos;re not *a* developer.
              <br />
              <span>You are the one.</span>
            </h1>
            <p className="hero-subtitle">
              This build of <strong>I Am The One</strong> gives you a real
              catalog, a working cart, and a checkout form that posts orders to
              your own backend. No hidden SDKs — you own everything.
            </p>

            <div className="hero-meta">
              <span>
                <strong>{productCount}</strong> products
              </span>
              <span>
                <strong>${avgPrice.toFixed(2)}</strong> avg price
              </span>
              <span>
                <strong>React · Vite · TS</strong>
              </span>
            </div>
          </div>

          <aside className="hero-card">
            <div className="hero-card-header">
              <div className="hero-card-title">Checkout Flow</div>
              <div style={{ fontSize: 11, color: "#22c55e" }}>API-Ready</div>
            </div>
            <div className="hero-metric">${cartTotal.toFixed(2)}</div>
            <div
              style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10 }}
            >
              Cart total calculated on the client. On submit, a JSON payload is
              sent to your backend so it can charge, log, and fulfill.
            </div>
            <div className="hero-pill-row">
              <div className="hero-pill">Local Cart</div>
              <div className="hero-pill">Backend Hook</div>
              <div className="hero-pill">Stripe-Ready</div>
            </div>
            <div className="hero-footer">
              Swap the endpoint implementation to Stripe, PayPal, or your own
              merchant account when you&apos;re ready.
            </div>
          </aside>
        </section>

        {/* CATALOG */}
        <section>
          <div className="section-header">
            <div>
              <div className="section-kicker">CATALOG</div>
              <div className="section-title">I Am The One · Products</div>
            </div>
            <div className="section-sub">
              Click &quot;Add to cart&quot; to build an order and test the
              checkout pipeline.
            </div>
          </div>

          <div className="product-grid">
            {products.map((p) => (
              <article key={p.id} className="product-card">
                <img src={p.imageUrl} alt={p.name} />
                <div className="product-name">{p.name}</div>
                <div className="product-price">${p.price.toFixed(2)}</div>
                <div className="product-meta">
                  Demo SKU · Local Data · No External Requests
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(p.id)}
                  style={{
                    marginTop: 6,
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: "none",
                    background:
                      "linear-gradient(135deg, #f97316, #eab308)",
                    color: "#020617",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Add to cart
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* CART + CHECKOUT */}
        <section style={{ marginTop: 32 }}>
          <div className="section-header">
            <div>
              <div className="section-kicker">CART & CHECKOUT</div>
              <div className="section-title">Your Order</div>
            </div>
            <div className="section-sub">
              Total: ${cartTotal.toFixed(2)} · Items: {cartQuantity}
            </div>
          </div>

          {cart.length === 0 ? (
            <p style={{ fontSize: 13, color: "#9ca3af" }}>
              Cart is empty. Add items from the catalog above to build an
              order.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 20,
                gridTemplateColumns: "1.2fr 1fr",
              }}
            >
              {/* Cart list */}
              <div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    maxWidth: 600,
                  }}
                >
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "6px 0",
                        borderBottom:
                          "1px solid rgba(148, 163, 184, 0.35)",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {item.name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#9ca3af",
                          }}
                        >
                          {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          fontSize: 11,
                          padding: "4px 8px",
                          borderRadius: 999,
                          border:
                            "1px solid rgba(248, 113, 113, 0.9)",
                          background: "transparent",
                          color: "#fecaca",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stripe Checkout form */}
              <div>
                <div
                  style={{
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Checkout Details (Stripe Test Mode)
                </div>
                <CheckoutForm
                  cartItems={stripeCartItems}
                  onSuccess={handleCheckoutSuccess}
                />
              </div>
            </div>
          )}
        </section>

        {/* STORY */}
        <section className="story">
          <p>
            <strong>I Am The One</strong> is a front-end store that&apos;s ready
            to hook into your own backend. You decide how to charge customers,
            how to store orders, and how to deploy — nothing is hidden.
          </p>
          <p style={{ marginTop: 10 }}>
            To start selling for real, wire your checkout endpoint to your
            payment processor and database. Until then, this is a perfect demo
            and portfolio piece showing that you can ship a full UI.
          </p>
        </section>

        <footer className="app-footer">
          I Am The One · Front-end Storefront · React + Vite + TypeScript
        </footer>
      </main>

      {/* ORDER COMPLETE MODAL */}
      {showOrderModal && lastOrder && (
        <div className="modal-backdrop" onClick={() => setShowOrderModal(false)}>
          <div
            className="modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-pill">ORDER COMPLETE</span>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowOrderModal(false)}
              >
                ×
              </button>
            </div>
            <h2 className="modal-title">Purchase Confirmed</h2>
            <p className="modal-subtitle">
              This instance is wired end-to-end. Stripe charged in test mode,
              and your frontend is production-ready.
            </p>
            <div className="modal-body">
              <div className="modal-summary">
                <div>
                  <span className="modal-label">Items</span>
                  <span className="modal-value">{lastOrder.items.length}</span>
                </div>
                <div>
                  <span className="modal-label">Total</span>
                  <span className="modal-value">
                    ${lastOrder.total.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="modal-label">Mode</span>
                  <span className="modal-value">{storeLabel}</span>
                </div>
              </div>
              <div className="modal-list">
                {lastOrder.items.map((item) => (
                  <div key={item.id} className="modal-line-item">
                    <div className="modal-line-name">{item.name}</div>
                    <div className="modal-line-meta">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="modal-button"
              onClick={() => setShowOrderModal(false)}
            >
              Close · Ready for Deployment
            </button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.visible && (
        <div className="toast-root">
          <div className="toast-card">
            <span className="toast-dot" />
            <span className="toast-message">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

