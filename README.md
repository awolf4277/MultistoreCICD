# I Am The One · Multi-Store Commerce Engine

A React + Vite + TypeScript storefront with a **100-product catalog**, **live inventory per store mode**, and a **checkout flow wired to a real backend endpoint**.

On top of this, I run the whole thing through an internal **operator console** called **Wolf_OS**, which monitors backend health and system status.

---

## 👀 For Hiring Managers / Instructors

This project demonstrates that I can:

- Design and ship a **production-style storefront** (catalog → cart → checkout) with clear state management and UX.
- Wire a **TypeScript React front-end to a Python/Flask backend**, including a payment-ready checkout hook.
- Think beyond “just a UI” and build an **operator console (Wolf_OS)** that monitors system health and environment modes.
- Handle **accessibility and motion sensitivity** with a first-run notice, reduced-motion mode, and persisted user preferences.

---

## 🔧 Tech Stack

### Frontend (Storefront)

- React 18 + TypeScript
- Vite
- Custom CSS (no UI framework)
- Accessibility + reduced-motion support

### Backend (API)

- Python
- Flask
- Stripe-ready `/api/checkout` hook (demo/test mode)
- Additional endpoints (health & metrics), e.g.:
  - `GET /api/health` – backend status
  - `GET /api/orders/recent` – recent orders feed (sample or real DB)

### Operator Console (Wolf_OS)

- Python “kernel” (`wolf_os.py`)
- React + Vite UI (`wolf-os-ui`)
- Talks to the same Flask backend used by the storefront
- Launched via a PowerShell boot script (`start-operator.ps1`)

---

## ✨ Core Storefront Features

- **100-product catalog**  
  Defined in `src/products.ts` with realistic categories and prices. Products are generated from archetypes (monitors, headphones, apparel, home goods, etc.) so the catalog feels like a real store.

- **Local cart with line-item math**  
  - Add/remove items from the catalog.
  - Client-side subtotal + grand total.
  - Summary shown in both the hero metrics and the cart panel.

- **Inventory simulation per store mode**
  - Each product has its own stock count per store.
  - Adding to cart decrements inventory.
  - Removing from cart restores stock.
  - Store switching resets inventory + cart so you can demo clean scenarios.

- **Multi-store modes**
  - `Main Store` – default “production-like” inventory.
  - `Dev Sandbox` – generous inventory for testing.
  - `Experimental Sandbox` – overloaded stock for stress tests.
  - UI clearly shows current mode: `MODE: Main Store / Dev Sandbox / Experimental Sandbox`.

- **Checkout form wired to backend**
  - Name, email, and cart payload are posted to `/api/checkout`.
  - Backend is designed to be wired to Stripe, PayPal, or any custom merchant.
  - Demo mode acknowledges the payment without charging real cards.

- **Order recap**
  - After a successful checkout, the UI shows something like:
    > Last order captured in \<Store\>: $X.XX (N line items).

- **Accessibility & motion control**
  - First-run **Accessibility & Motion Notice** explains that the UI uses glow/zoom effects.
  - Users can choose:
    - **Keep animations on** – full hover and strobe-style effects.
    - **Reduce motion** – calmer cards and cart, toned-down hover effects.
  - Persistent preference via `localStorage` plus `prefers-reduced-motion` support.
  - Status bar toggle shows current setting: `Motion: Full` / `Motion: Reduced`.

---

## 🧠 How It Works (Frontend + Backend)

### Frontend State (in `src/App.tsx`)

Key pieces of state:

- `store: "main" | "dev" | "sandbox"`  
  Controls which inventory slice is active.

- `inventory: Record<string, number>`  
  Map of product ID → stock for the current store.

- `cart: CartItem[]`  
  Array of `{ ...product, quantity }`. Drives cart list and totals.

- `lastOrder: { items; total; store } | null`  
  Snapshot of the most recent successful order, displayed under the checkout.

- `reducedMotion: boolean`  
  Controls animation classes:
  - Cards: `product-card-animated` vs `product-card-static`
  - Cart panel: `cart-shell-animated` vs `cart-shell-static`

- `showAccessibilityNotice: boolean`  
  Toggles the full-screen **Accessibility & Motion Notice** overlay.

### Inventory Rules

- **Add to cart**
  - If stock > 0:
    - Increment quantity if item already in cart.
    - Otherwise, push a new cart item.
    - Decrement inventory for that product.

- **Remove from cart**
  - Returns the item’s full quantity to inventory.
  - Removes the cart line from the list.

- **Changing store**
  - Updates `store`.
  - Resets `inventory` to the initial values for that mode.
  - Clears `cart` and `lastOrder`.

### Backend Contract

Frontend sends a POST to:

```http
POST {VITE_BACKEND_URL}/api/checkout
Content-Type: application/json



+------------------------------+
|         Wolf_OS UI (React)   |
|  - System Monitor            |
|  - Event Log                 |
|  - Operator Commands (future)|
+--------------+---------------+
               |
               v
+------------------------------+
| Wolf_OS Python Kernel        |
| - Boots UI (Vite)            |
| - Pings Multistore backend   |
+--------------+---------------+
               |
               v
+------------------------------+
| Multistore Backend (Flask)   |
| - /api/health                |
| - /api/orders/recent         |
| - /api/products / inventory  |
| - /api/checkout              |
+--------------+---------------+
               ^
               |
+------------------------------+
| Multistore Frontend (React)  |
| - 100-product catalog        |
| - Cart + checkout form       |
| - Motion/FX controls         |
+------------------------------+
