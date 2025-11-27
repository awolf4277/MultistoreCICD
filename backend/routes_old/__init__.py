from flask import Flask, jsonify
from .config import load_config
from .routes.checkout import checkout_bp


def create_app():
    app = Flask(__name__)
    load_config(app)

    @app.get("/health")
    def health():
        return jsonify(
            {
                "ok": True,
                "service": "i_am_the_one_backend",
                "message": "running",
                "author": "Andrew Wolverton",
                
                "copyright": app.config.get(
                    "COPYRIGHT_NOTICE"
                ),  # © 2025 Andrew Wolverton…
            }
        ), 200

    # /api/checkout/create-payment-intent
    app.register_blueprint(checkout_bp, url_prefix="/api/checkout")

    return app



