from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import Store, User, Product


stores_bp = Blueprint("stores", __name__)


def simple_slug(name: str) -> str:
    # Fallback in case python-slugify is not installed
    return (
        "".join(ch if ch.isalnum() else "-" for ch in name.lower())
        .strip("-")
        .replace("--", "-")
    )


@stores_bp.post("")
@jwt_required()
def create_store():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404

    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    slug = (data.get("slug") or "").strip().lower()

    if not name:
        return jsonify({"error": "name required"}), 400

    if not slug:
        slug = simple_slug(name)

    if Store.query.filter_by(slug=slug).first():
        return jsonify({"error": "slug already taken"}), 400

    store = Store(name=name, slug=slug, owner_id=user.id)
    db.session.add(store)
    db.session.commit()

    return jsonify(store.to_dict()), 201


@stores_bp.get("")
@jwt_required()
def list_my_stores():
    user_id = get_jwt_identity()
    stores = Store.query.filter_by(owner_id=user_id).all()
    return jsonify([s.to_dict() for s in stores])


# Public endpoint: store details + products by slug
@stores_bp.get("/public/<slug>")
def public_store(slug):
    store = Store.query.filter_by(slug=slug).first()
    if not store:
        return jsonify({"error": "store not found"}), 404

    products = (
        Product.query.filter_by(store_id=store.id, active=True)
        .order_by(Product.id.asc())
        .all()
    )

    return jsonify(
        {
            "store": store.to_dict(),
            "products": [p.to_dict() for p in products],
        }
    )
