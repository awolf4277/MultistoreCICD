import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_ROOT = os.path.dirname(BASE_DIR)
DOTENV_PATH = os.path.join(BACKEND_ROOT, ".env")


def load_config(app):
    # Load backend .env once
    if os.path.exists(DOTENV_PATH):
        load_dotenv(DOTENV_PATH)

    app.config["STRIPE_SECRET_KEY"] = os.getenv("STRIPE_SECRET_KEY")
    app.config["FRONTEND_URL"] = os.getenv("FRONTEND_URL", "http://127.0.0.1:5173")

    print("=== STRIPE ENV DEBUG ===")
    print("DOTENV_PATH:", DOTENV_PATH)
    print("STRIPE_SECRET_KEY present:", bool(app.config["STRIPE_SECRET_KEY"]))
    print("=========================")
