from flask import jsonify
from . import orders_bp
from ..models import Order, OrderItem, Store

def get_default_store():
    return Store.query.filter_by(slug="default").first()

@orders_bp.get("")
def list_orders():
    store = get_default_store()
    if not store:
        return jsonify([]), 200

    orders = Order.query.filter_by(store_id=store.id).order_by(Order.created_at.desc()).all()
    resp = []
    for o in orders:
        resp.append({
            "id": o.id,
            "customerName": o.customer_name,
            "customerEmail": o.customer_email,
            "customerAddress": o.customer_address,
            "total": o.total,
            "createdAt": o.created_at.isoformat(),
            "items": [
                {
                    "productName": i.product_name,
                    "unitPrice": i.unit_price,
                    "quantity": i.quantity,
                }
                for i in o.items
            ],
        })
    return jsonify(resp), 200
