# backend/app/routes/checkout.py
import stripe
from flask import Blueprint, jsonify, request, current_app

checkout_bp = Blueprint("checkout", __name__)


@checkout_bp.post("/create-payment-intent")
def create_payment_intent():
  """
  Create a Stripe PaymentIntent in TEST MODE.

  Expects JSON:
  {
    "amount": 12345,  # integer cents
    "items": [{ "id": "...", "quantity": 1 }, ...],
    "customer": { "name": "...", "email": "..." }
  }
  """
  secret_key = current_app.config.get("STRIPE_SECRET_KEY")
  if not secret_key:
      return (
          jsonify(
              {
                  "ok": False,
                  "error": "Stripe secret key is not configured on the server.",
              }
          ),
          500,
      )

  stripe.api_key = secret_key

  data = request.get_json(silent=True) or {}
  amount = data.get("amount")
  items = data.get("items", [])
  customer = data.get("customer", {})

  if not isinstance(amount, int) or amount <= 0:
      return (
          jsonify(
              {
                  "ok": False,
                  "error": "Invalid or missing 'amount' (must be positive integer cents).",
              }
          ),
          400,
      )

  try:
      intent = stripe.PaymentIntent.create(
          amount=amount,
          currency="usd",
          automatic_payment_methods={"enabled": True},
          receipt_email=customer.get("email"),
          metadata={
              "customer_name": customer.get("name", ""),
              "order_item_count": len(items),
              "demo_engine": "I Am The One",
          },
      )
  except stripe.error.StripeError as e:
      return (
          jsonify(
              {
                  "ok": False,
                  "error": "Stripe error",
                  "details": str(e),
              }
          ),
          500,
      )

  return (
      jsonify(
          {
              "ok": True,
              "message": "PaymentIntent created in Stripe TEST MODE.",
              "clientSecret": intent.client_secret,
          }
      ),
      200,
  )

