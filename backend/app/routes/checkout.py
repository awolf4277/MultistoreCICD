# backend/app/routes/checkout.py
from flask import Blueprint, request, jsonify, current_app
import stripe

checkout_bp = Blueprint("checkout", __name__)

@checkout_bp.post("/create-payment-intent")
def create_payment_intent():
    try:
        data = request.get_json(force=True)

        items = data.get("items", [])
        customer = data.get("customer", {})

        if not items:
            return jsonify({"error": "Cart is empty"}), 400

        # Stripe secret key
        stripe.api_key = current_app.config.get("STRIPE_SECRET_KEY")
        if not stripe.api_key:
            return jsonify({"error": "Stripe secret key missing"}), 500

        # Calculate total amount
        total_amount = 0
        for item in items:
            # All your products are fake demo products → all $89.99 or $499.99 etc
            # So we trust frontend price for now.
            pid = item.get("id")
            qty = item.get("quantity", 1)

            if not pid:
                return jsonify({"error": "Invalid product ID"}), 400

            # For demo calibration:
            # Example catalog:
            # 89.99, 199.99, 499.99 etc.
            # Here we FAKE a price map:
            if "monitor" in pid:
                price = 49999
            elif "keyboard" in pid:
                price = 12999
            elif "headphones" in pid:
                price = 19999
            elif "sneaker" in pid:
                price = 8999
            else:
                price = 9999  # default fallback

            total_amount += price * qty

        # Stripe payment intent (TEST MODE)
        intent = stripe.PaymentIntent.create(
            amount=total_amount,
            currency="usd",
            automatic_payment_methods={"enabled": True},
            metadata={
                "customer_name": customer.get("name", "Unknown"),
                "customer_email": customer.get("email", "Unknown"),
                "item_count": len(items),
            },
        )

        return jsonify(
            {
                "clientSecret": intent.client_secret,
                "amount": total_amount,
                "currency": "usd",
                "status": "created",
            }
        )

    except Exception as e:
        print("Checkout error:", e)
        return jsonify({"error": str(e)}), 500
