from flask import Blueprint, current_app, jsonify, request
import stripe

checkout_bp = Blueprint("checkout", __name__)


def calculate_order_amount(items):
    """
    Demo calculation: charge $10 per item (quantity-based), no product lookup.
    Keeps it simple and avoids 400 errors from unknown product IDs.
    """
    total_cents = 0
    for item in items:
        try:
            qty = int(item.get("quantity", 1))
        except (TypeError, ValueError):
            qty = 1
        total_cents += qty * 1000  # $10.00 per item
    # Never less than $1.00 in test mode
    return max(total_cents, 100)


@checkout_bp.before_app_request
def setup_stripe():
    """
    Ensure stripe.api_key is set from Flask config before handling any request.
    """
    secret = current_app.config.get("STRIPE_SECRET_KEY")
    if secret:
        stripe.api_key = secret


@checkout_bp.post("/create-payment-intent")
def create_payment_intent():
    secret = current_app.config.get("STRIPE_SECRET_KEY")
    if not secret:
        return jsonify({"error": "Stripe API key is not configured"}), 500

    try:
        data = request.get_json() or {}
        items = data.get("items") or []
        customer = data.get("customer") or {}

        if not items:
            return jsonify({"error": "No items in cart"}), 400

        amount = calculate_order_amount(items)

        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            automatic_payment_methods={"enabled": True},
            metadata={
                "customer_email": customer.get("email", ""),
                "customer_name": customer.get("name", ""),
            },
        )

        return jsonify({
            "clientSecret": payment_intent.client_secret,
            "amount": amount,
            "currency": "usd",
        }), 200

    except stripe.error.StripeError as e:
        # Stripe-specific error (bad key, invalid params, etc.)
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        # Catch-all so the frontend never sees a cryptic HTML 500
        print("Unexpected error in /api/checkout/create-payment-intent:", e)
        return jsonify({"error": "Internal server error"}), 500
