from flask import Flask, request, jsonify
import os
from uuid import uuid4

app = Flask(__name__)

@app.post("/api/checkout")
def checkout():
  data = request.get_json(force=True, silent=True) or {}
  customer = data.get("customer") or {}
  items = data.get("items") or []
  total = data.get("total") or 0

  # TODO: here is where you would:
  # - validate items/prices
  # - create a payment (Stripe, PayPal, etc.)
  # - store the order in a database

  # For now, we just return a fake order id.
  order_id = str(uuid4())
  print("NEW ORDER:", {
    "order_id": order_id,
    "customer": customer,
    "items": items,
    "total": total,
  })

  return jsonify({"ok": True, "orderId": order_id}), 200

@app.get("/api/health")
def health():
  return jsonify({"ok": True, "service": "i_am_the_one_backend"}), 200

if __name__ == "__main__":
  app.run(host="127.0.0.1", port=5000, debug=True)
