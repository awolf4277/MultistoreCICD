import os
from dotenv import load_dotenv

load_dotenv()

def load_config(app):
    app.config["STRIPE_SECRET_KEY"] = os.getenv("STRIPE_SECRET_KEY")
    app.config["STRIPE_PUBLISHABLE_KEY"] = os.getenv("STRIPE_PUBLISHABLE_KEY")
    app.config["STRIPE_WEBHOOK_SECRET"] = os.getenv("STRIPE_WEBHOOK_SECRET")
    app.config["FRONTEND_URL"] = os.getenv("FRONTEND_URL", "http://127.0.0.1:5173")
