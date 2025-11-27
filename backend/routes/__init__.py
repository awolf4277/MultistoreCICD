from flask import Flask, jsonify
from flask_cors import CORS
from .config import load_config
from .routes.checkout import checkout_bp


def create_app():
    app = Flask(__name__)
    load_config(app)

    # Allow Vite frontend to talk to this API
    CORS(
        app,
        resources={r"/api/*": {
            "origins": app.config.get("FRONTEND_URL", "http://127.0.0.1:5173")
        }},
        supports_credentials=False,
    )

    @app.get("/health")
    def health():
        return jsonify({
            "ok": True,
            "service": "i_am_the_one_backend",
            "message": "running",
        }), 200

    # /api/checkout/create-payment-intent
    app.register_blueprint(checkout_bp, url_prefix="/api/checkout")

    return app
