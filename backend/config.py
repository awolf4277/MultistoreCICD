import os
from dotenv import load_dotenv

load_dotenv()

COPYRIGHT_NOTICE = (
    '© 2025 Andrew Wolverton. "I Am The One" Multi-Store Commerce Engine. '
    "All rights reserved."
)


def load_config(app):
    """
    Load configuration values from environment variables into the Flask app.
    """
    app.config["STRIPE_SECRET_KEY"] = os.getenv("STRIPE_SECRET_KEY")
    app.config["STRIPE_PUBLISHABLE_KEY"] = os.getenv("STRIPE_PUBLISHABLE_KEY")
    app.config["STRIPE_WEBHOOK_SECRET"] = os.getenv("STRIPE_WEBHOOK_SECRET")
    app.config["FRONTEND_URL"] = os.getenv("FRONTEND_URL", "http://127.0.0.1:5173")

    # Make copyright available everywhere
    app.config["COPYRIGHT_NOTICE"] = COPYRIGHT_NOTICE

