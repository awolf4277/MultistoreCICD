# I Am The One · Multi-Store Commerce Engine

I Am The One is a front-end store that's ready to hook into your own backend.  
You decide how to charge customers, how to store orders, and how to deploy — nothing is hidden.

To start selling for real, wire your checkout endpoint to your payment processor and database.  
Until then, this is a perfect demo and portfolio piece showing that you can ship a full UI.

---

## Tech Stack

- **Front-end:** React · TypeScript · Vite
- **Styling:** Custom CSS (app shell, hero, catalog, cart, modal, toast)
- **State:** Local React state for cart, checkout, toast, and order summary
- **Backend-ready:** Sends structured cart data that can be posted to your own API
- **Stripe-ready:** Checkout UI is designed to plug into a Stripe (or other) backend endpoint

---

## Features

- Product catalog with local demo data (`products.ts`)
- Add/remove items from cart with quantity tracking
- Live cart total and item counts
- Checkout form wired to a backend endpoint (Stripe test-mode friendly)
- Order confirmation modal with line items and totals
- Store mode switcher (Main / Dev / Sandbox)
- System status strip and “FRONT-END · FULLY OPERATIONAL” hero tag
- Toast notifications when items are added

---

## Running the Front-End

From the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
