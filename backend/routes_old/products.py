from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import Store, Product

products_bp = Blueprint("products", __name__)


def _get_owned_store_or_404(store_id: int, owner_id: int):
  store = Store.query.filter_by(id=store_id, owner_id=owner_id).first()
  if not store:
      return None
  return store


@products_bp.post("")
@jwt_required()
def create_product():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    store_id = data.get("store_id")
    if not store_id:
        return jsonify({"error": "store_id required"}), 400

    store = _get_owned_store_or_404(store_id, user_id)
    if not store:
        return jsonify({"error": "store not found or not owned by you"}), 404

    name = (data.get("name") or "").strip()
    price = data.get("price")  # dollars
    sku = (data.get("sku") or "").strip() or None
    image_url = (data.get("image_url") or "").strip() or None
    description = data.get("description") or None

    if not name or price is None:
        return jsonify({"error": "name and price required"}), 400

    try:
        price_cents = int(round(float(price) * 100))
    except ValueError:
        return jsonify({"error": "invalid price format"}), 400

    product = Product(
        store_id=store.id,
        name=name,
        sku=sku,
        price_cents=price_cents,
        image_url=image_url,
        description=description,
        active=True,
    )
    db.session.add(product)
    db.session.commit()

    return jsonify(product.to_dict()), 201


@products_bp.get("/by-store/<int:store_id>")
@jwt_required()
def list_products_for_store(store_id):
    user_id = get_jwt_identity()
    store = _get_owned_store_or_404(store_id, user_id)
    if not store:
        return jsonify({"error": "store not found or not owned by you"}), 404

    products = Product.query.filter_by(store_id=store.id).all()
    return jsonify([p.to_dict() for p in products])
