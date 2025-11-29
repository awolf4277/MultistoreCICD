// src/App.tsx
import React from "react";
import { products } from "./products";
import CheckoutForm from "./components/CheckoutForm";

type Product = (typeof products)[number];

interface CartItem extends Product {
  quantity: number;
}

type StoreMode = "main" | "dev" | "sandbox";
type Inventory = Record<string, number>;

interface LastOrder {
  items: CartItem[];
  total: number;
  store: StoreMode;
}

// normalize product id into a string key
function keyFor(id: Product["id"]): string {
  return String(id);
}

// initial inventory per store (demo values)
const initialInventoryByStore: Record<StoreMode, Inventory> = {
  main: Object.fromEntries(products.map((p) => [keyFor(p.id), 8])),
  dev: Object.fromEntries(products.map((p) => [keyFor(p.id), 99])),
  sandbox: Object.fromEntries(products.map((p) => [keyFor(p.id), 999])),
};

function cloneInventory(mode: StoreMode): Inventory {
  return { ...initialInventoryByStore[mode] };
}

function storeLabel(mode: StoreMode) {
  if (mode === "main") return "Main Store";
  if (mode === "dev") return "Dev Sandbox";
  return "Experimental Sandbox";
}

const App: React.FC = () => {
  const [store, setStore] = React.useState<StoreMode>("main");
  const [inventory, setInventory] = React.useState<Inventory>(() =>
    cloneInventory("main")
  );
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [lastOrder, setLastOrder] = React.useState<LastOrder | null>(null);
  const [selectedProductId, setSelectedProductId] =
    React.useState<string | null>(null);

  // derived stats
  const productCount = products.length;
  const avgPrice =
    products.reduce((sum, p) => sum + p.price, 0) /
    Math.max(productCount, 1);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const stripeCartItems = cart.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }));

  // helpers
  function getStockFor(product: Product): number {
    return inventory[keyFor(product.id)] ?? 0;
  }

  function handleStoreChange(next: StoreMode) {
    if (next === store) return;
    setStore(next);
    setInventory(cloneInventory(next));
    setCart([]);
    setLastOrder(null);
    setSelectedProductId(null);
  }

  function addToCart(product: Product) {
    const stock = getStockFor(product);
    if (stock <= 0) {
      return;
    }

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

    setInventory((prev) => {
      const k = keyFor(product.id);
      return {
        ...prev,
        [k]: (prev[k] ?? 0) - 1,
      };
    });

    // highlight this product with the strobe effect
    setSelectedProductId(keyFor(product.id));
  }

  function removeFromCart(id: Product["id"]) {
    const k = keyFor(id);

    setCart((prev) => {
      const item = prev.find((p) => keyFor(p.id) === k);
      if (!item) return prev;

      // restore quantity back to inventory
      setInventory((invPrev) => ({
        ...invPrev,
        [k]: (invPrev[k] ?? 0) + item.quantity,
      }));

      return prev.filter((p) => keyFor(p.id) !== k);
    });

    // if the removed product was selected, clear selection
    setSelectedProductId((current) => (current === k ? null : current));
  }

  function handleCheckoutSuccess() {
    if (cart.length === 0) return;
    setLastOrder({ items: cart, total: cartTotal, store });
    setCart([]);
    setSelectedProductId(null);
  }

  return (
    <div className="app-root">
      {/* SYSTEM STATUS BAR */}
      <header className="status-bar">
        <div className="status-left">
          <span className="status-pill status-green">
            SYSTEM STATUS: GREEN · All services operational
          </span>
        </div>
        <div className="status-right">
          <span className="status-stat">
            MODE: <strong>{storeLabel(store)}</strong>
          </span>
          <span className="status-stat">
            Cart · <strong>{cartItemCount}</strong>
          </span>
        </div>
      </header>

      {/* HERO */}
      <section className="hero hero--compact">
        <div className="hero-left">
          <div className="eyebrow">I AM THE ONE</div>
          <h1 className="hero-title">
            Multi-Store Commerce Engine
            <span className="hero-gradient">
              {" "}
              · Catalog · Cart · Checkout
            </span>
          </h1>
          <p className="hero-subtitle">
            This build of I Am The One gives you a real catalog, a working
            cart, and a checkout form that posts orders to your own backend.
            No hidden SDKs — you own everything.
          </p>

          <div className="hero-badges">
            <span className="badge badge-soft">
              {productCount} products
            </span>
            <span className="badge badge-soft">
              ${avgPrice.toFixed(2)} avg price
            </span>
            <span className="badge badge-soft">React · Vite · TS</span>
          </div>
        </div>

        <div className="hero-right hero-right--stack">
          <div className="metric-card">
            <div className="metric-label">Checkout Flow</div>
            <div className="metric-value">API-Ready</div>
            <div className="metric-caption">
              ${cartTotal.toFixed(2)} ·{" "}
              {cartItemCount === 1
                ? "1 item in cart"
                : `${cartItemCount} items in cart`}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Local Cart</div>
            <div className="metric-caption">
              Cart total calculated on the client. On submit, a JSON payload is
              sent to your backend so it can charge, log, and fulfill.
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Backend Hook</div>
            <div className="metric-caption">
              Stripe-ready. Swap the endpoint implementation to Stripe, PayPal,
              or your own merchant when you&apos;re ready.
            </div>
          </div>
        </div>
      </section>

      {/* STORE MODE TOGGLE */}
      <section className="store-toggle">
        <div className="toggle-group">
          <button
            className={`toggle-button ${store === "main" ? "active" : ""}`}
            onClick={() => handleStoreChange("main")}
          >
            Main
          </button>
          <button
            className={`toggle-button ${store === "dev" ? "active" : ""}`}
            onClick={() => handleStoreChange("dev")}
          >
            Dev
          </button>
          <button
            className={`toggle-button ${store === "sandbox" ? "active" : ""}`}
            onClick={() => handleStoreChange("sandbox")}
          >
            Sandbox
          </button>
        </div>
        <p className="store-note">
          <strong>{storeLabel(store)}</strong> · Same UI, different backend
          config. Wire each mode to different environments or Stripe accounts.
        </p>
      </section>

      {/* MAIN LAYOUT */}
      <main className="layout">
        {/* CATALOG */}
        <section className="panel panel-left">
          <div className="panel-header">
            <h2>CATALOG · I Am The One · Products</h2>
            <p>Click “Add to cart” to build an order and test the pipeline.</p>
          </div>

          <div className="product-grid">
            {products.map((product) => {
              const stock = getStockFor(product);
              const outOfStock = stock <= 0;
              const lowStock = stock > 0 && stock <= 2;
              const isSelected = selectedProductId === keyFor(product.id);

              return (
                <article
                  key={keyFor(product.id)}
                  className={`product-card ${
                    isSelected ? "product-card--selected" : ""
                  }`}
                >
                  <div className="product-header">
                    <h3 className="product-title">{product.name}</h3>
                  </div>

                  <p className="product-description">
                    Demo SKU · Local Data · No External Requests
                  </p>

                  <div className="product-footer">
                    <span className="product-price">
                      ${product.price.toFixed(2)}
                    </span>
                    <span
                      className={`inventory-pill ${
                        outOfStock
                          ? "inventory-out"
                          : lowStock
                          ? "inventory-low"
                          : ""
                      }`}
                    >
                      {outOfStock
                        ? "Out of stock"
                        : `In stock: ${stock}`}
                    </span>
                    <button
                      className="btn-primary"
                      onClick={() => addToCart(product)}
                      disabled={outOfStock}
                    >
                      {outOfStock ? "Unavailable" : "Add to cart"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* CART & CHECKOUT */}
        <section className="panel panel-right">
          <div className="panel-header">
            <h2>CART & CHECKOUT</h2>
            <p>Your Order</p>
          </div>

          <div className="cart-section">
            <div className="cart-summary">
              <div className="cart-total-row">
                <span>
                  Total: ${cartTotal.toFixed(2)} · Items: {cartItemCount}
                </span>
              </div>
            </div>

            {cart.length === 0 ? (
              <p className="cart-empty">
                Cart is empty. Add items from the catalog above to build an
                order.
              </p>
            ) : (
              <ul className="cart-list">
                {cart.map((item) => (
                  <li key={keyFor(item.id)} className="cart-item">
                    <div className="cart-main">
                      <div className="cart-title">{item.name}</div>
                      <div className="cart-meta">
                        <span>${item.price.toFixed(2)}</span>
                        <span>× {item.quantity}</span>
                        <span className="cart-subtotal">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="cart-actions">
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
          </div>

          <div className="checkout-section">
            <CheckoutForm
              cartItems={stripeCartItems}
              cartTotal={cartTotal}
              onSuccess={handleCheckoutSuccess}
            />
          </div>

          <div className="checkout-copy">
            <p>
              I Am The One is a front-end store that&apos;s ready to hook into
              your own backend. You decide how to charge customers, how to
              store orders, and how to deploy — nothing is hidden.
            </p>
            <p>
              To start selling for real, wire your checkout endpoint to your
              payment processor and database. Until then, this is a perfect demo
              and portfolio piece showing that you can ship a full UI.
            </p>
            {lastOrder && (
              <p className="success-text">
                Last order captured in {storeLabel(lastOrder.store)}: $
                {lastOrder.total.toFixed(2)} ({lastOrder.items.length} line
                items).
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>
          I Am The One · Front-end Storefront · React + Vite + TypeScript
        </span>
        <span>
          © 2025 Andrew Wolverton. &quot;I Am The One&quot; Multi-Store Commerce
          Engine. All rights reserved.
        </span>
      </footer>
    </div>
  );
};

export default App;


