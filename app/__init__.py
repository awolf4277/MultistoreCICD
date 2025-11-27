# app/__init__.py
from flask import Flask, jsonify, request
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.get("/health")
    def health():
        return jsonify({"ok": True, "service": "multistore-backend"}), 200

    @app.post("/api/checkout")
    def checkout():
        data = request.get_json() or {}
        name = data.get("name")
        email = data.get("email")
        cart_items = data.get("cartItems", [])
        cart_total = data.get("cartTotal", 0)

        print("NEW ORDER:", name, email, cart_total, cart_items)

        return jsonify(
            {
                "status": "ok",
                "message": "Order received in test mode.",
            }
        ), 200

    return app

# Expose app instance for Flask CLI
app = create_app()
