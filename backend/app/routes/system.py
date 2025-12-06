# app/routes/system.py
from flask import Blueprint, jsonify, request
import time
from datetime import datetime, timedelta

from ..extensions import db

system_bp = Blueprint("system", __name__)

# Try to import a real Order model; fall back to sample data if that fails.
try:
    # If your Order model lives somewhere else, adjust this import:
    # from ..models.order import Order
    from ..models import Order  # type: ignore
    HAS_ORDER_MODEL = True
except Exception:
    Order = None  # type: ignore
    HAS_ORDER_MODEL = False

# In-memory incident state
INCIDENT_STATE = {
    "level": "none",   # "none" | "minor" | "major"
    "last_pulse": None,
}


def _sample_orders():
    """Fallback data if we can't load or query a real Order model."""
    now = datetime.utcnow()
    return [
        {
            "id": "ORD-SAMPLE-1001",
            "store": "MAIN",
            "total": 249.99,
            "status": "paid",
            "created_at": (now - timedelta(minutes=5)).isoformat() + "Z",
        },
        {
            "id": "ORD-SAMPLE-1002",
            "store": "DEV",
            "total": 89.50,
            "status": "processing",
            "created_at": (now - timedelta(minutes=2)).isoformat() + "Z",
        },
        {
            "id": "ORD-SAMPLE-1003",
            "store": "SANDBOX",
            "total": 120.00,
            "status": "failed",
            "created_at": (now - timedelta(seconds=45)).isoformat() + "Z",
        },
    ]


def _db_orders(limit: int = 20):
    """
    Pull recent orders from the real database if Order model exists.

    This assumes your Order model has something like:
      - id
      - store/store_mode/environment
      - total or total_amount
      - status
      - created_at (datetime)
    """
    if not HAS_ORDER_MODEL:
        return None

    try:
        # Prefer created_at desc, fall back to id desc.
        order_by_field = getattr(Order, "created_at", getattr(Order, "id"))
        query = db.session.query(Order).order_by(order_by_field.desc()).limit(limit)
        rows = query.all()

        orders = []
        for o in rows:
            store = (
                getattr(o, "store_mode", None)
                or getattr(o, "store", None)
                or getattr(o, "environment", None)
                or "MAIN"
            )

            total = (
                getattr(o, "total_amount", None)
                or getattr(o, "total", None)
                or 0.0
            )

            status = getattr(o, "status", "unknown")

            created_at = getattr(o, "created_at", None)
            if isinstance(created_at, datetime):
                created_iso = created_at.isoformat() + "Z"
            else:
                created_iso = datetime.utcnow().isoformat() + "Z"

            orders.append(
                {
                    "id": str(getattr(o, "id", "UNKNOWN")),
                    "store": str(store),
                    "total": float(total),
                    "status": str(status),
                    "created_at": created_iso,
                }
            )
        return orders
    except Exception:
        # If anything blows up, we'll just fall back to sample data.
        return None


def _get_recent_orders():
    """Public helper: try DB first, then fall back to sample data."""
    orders = _db_orders(limit=20)
    if orders is not None and len(orders) > 0:
        return orders
    return _sample_orders()


# ---------- Core system endpoints ----------

@system_bp.get("/health")
def health():
    """
    Simple health check. If you mount this with url_prefix="/api",
    the final URL is /api/health
    """
    return jsonify(
        {
            "status": "ok",
            "service": "multistore-backend",
            "timestamp": time.time(),
            "incident_level": INCIDENT_STATE["level"],
        }
    ), 200


@system_bp.post("/system-pulse")
def system_pulse():
    """
    Simulate an incident level change.
    Accepts JSON: { "level": "none" | "minor" | "major" }.
    """
    data = request.get_json(silent=True) or {}
    level = data.get("level", "minor")

    if level not in {"none", "minor", "major"}:
        return jsonify({"ok": False, "error": "invalid level"}), 400

    INCIDENT_STATE["level"] = level
    INCIDENT_STATE["last_pulse"] = time.time()

    return jsonify({"ok": True, "incident": INCIDENT_STATE}), 200


@system_bp.get("/system-status")
def system_status():
    """
    Wolf_OS can read current incident state here.
    """
    return jsonify(
        {
            "ok": True,
            "incident": INCIDENT_STATE,
        }
    ), 200


@system_bp.get("/orders/recent")
def recent_orders():
    """
    Live orders feed for Wolf_OS dashboard.
    With url_prefix="/api", final URL is /api/orders/recent.
    """
    orders = _get_recent_orders()
    return jsonify({"ok": True, "orders": orders}), 200
