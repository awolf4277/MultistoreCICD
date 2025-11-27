# app/routes/checkout.py
import stripe
from flask import Blueprint, jsonify, request, current_app

checkout_bp = Blueprint("checkout", __name__)

@checkout_bp.post("/create-payment-intent")
def create_payment_intent():
    stripe.api_key = current_app.config["STRIPE_SECRET_KEY"]

    data = request.get_json() or {}
    amount = data.get("amount")

    if amount is None:
        return (
            jsonify(
                {
                    "ok": False,
                    "error": "Missing 'amount' in request body.",
                    "copyright": current_app.config[
                        "COPYRIGHT_NOTICE"
                    ],  # 👈 add this
                }
            ),
            400,
        )

    # --- your existing Stripe logic goes here ---
    # Example shape (keep your real code):
    intent = stripe.PaymentIntent.create(
        amount=amount,
        currency="usd",
        automatic_payment_methods={"enabled": True},
        metadata={"source": "i_am_the_one"},
    )

    return jsonify(
        {
            "ok": True,
            "payment_intent_id": intent.id,
            "client_secret": intent.client_secret,
            "copyright": current_app.config[
                "COPYRIGHT_NOTICE"
            ],  # 👈 add this
        }
    )

