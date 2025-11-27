from flask import Flask, jsonify
from flask_cors import CORS
from .config import DATABASE_URL
from .database import db
from .models import Store  # ensure models imported
from .routes import auth_bp, products_bp, orders_bp, checkout_bp

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    CORS(app)

    with app.app_context():
        db.create_all()
        # Ensure default store exists
        if not Store.query.filter_by(slug="default").first():
            store = Store(name="I Am The One", slug="default")
            db.session.add(store)
            db.session.commit()

    @app.get("/api/health")
    def health():
        return jsonify({"ok": True, "service": "i_am_the_one_backend"}), 200

    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(checkout_bp)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="127.0.0.1", port=5000, debug=True)
