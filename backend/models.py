from datetime import datetime
from .extensions import db, bcrypt


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=True)

    # Optional: when the user was created (good for accounts)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    stores = db.relationship("Store", back_populates="owner", lazy="dynamic")

    def set_password(self, password: str):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Store(db.Model):
    __tablename__ = "stores"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    owner = db.relationship("User", back_populates="stores")
    products = db.relationship("Product", back_populates="store", lazy="dynamic")
    orders = db.relationship("Order", back_populates="store", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "owner_id": self.owner_id,
            "created_at": self.created_at.isoformat(),
        }


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey("stores.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    sku = db.Column(db.String(100), nullable=True)
    price_cents = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    description = db.Column(db.Text, nullable=True)
    active = db.Column(db.Boolean, default=True)

    # NEW: currency & inventory for real-store behavior
    currency = db.Column(db.String(10), nullable=False, default="usd")
    inventory_qty = db.Column(db.Integer, nullable=True)  # null = unlimited

    store = db.relationship("Store", back_populates="products")

    # NEW: connect products to order items
    order_items = db.relationship(
        "OrderItem",
        back_populates="product",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "store_id": self.store_id,
            "name": self.name,
            "sku": self.sku,
            "price_cents": self.price_cents,
            "price": self.price_cents / 100.0,
            "currency": self.currency,
            "image_url": self.image_url,
            "description": self.description,
            "active": self.active,
            "inventory_qty": self.inventory_qty,
        }


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey("stores.id"), nullable=False)

    # Stripe integration
    stripe_payment_intent_id = db.Column(db.String(255), nullable=True)
    stripe_payment_status = db.Column(db.String(50), nullable=True)  # e.g. 'requires_payment_method', 'succeeded'

    # Customer info
    customer_email = db.Column(db.String(255), nullable=True)
    customer_name = db.Column(db.String(255), nullable=True)

    # Order totals / status
    total_cents = db.Column(db.Integer, nullable=False)
    currency = db.Column(db.String(10), nullable=False, default="usd")

    # pending, payment_required, paid, failed, cancelled, refunded...
    status = db.Column(db.String(50), default="pending")

    # Nice human-facing order ID like ORD-000123
    order_number = db.Column(db.String(50), unique=True, index=True, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    store = db.relationship("Store", back_populates="orders")

    # NEW: line items + webhook events
    items = db.relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="joined",
    )
    payment_events = db.relationship(
        "PaymentEvent",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="dynamic",
    )

    def to_dict(self, include_items: bool = True):
        data = {
            "id": self.id,
            "store_id": self.store_id,
            "order_number": self.order_number,
            "stripe_payment_intent_id": self.stripe_payment_intent_id,
            "stripe_payment_status": self.stripe_payment_status,
            "customer_email": self.customer_email,
            "customer_name": self.customer_name,
            "total_cents": self.total_cents,
            "total": self.total_cents / 100.0,
            "currency": self.currency,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

        if include_items:
            data["items"] = [item.to_dict() for item in self.items]

        return data


class OrderItem(db.Model):
    """
    Individual line items for an order. This is critical for a real store:
    you know exactly what was purchased, at what price, at that moment in time.
    """
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)

    # Snapshots at purchase time (so changing product later doesn't change history)
    product_name_snapshot = db.Column(db.String(255), nullable=False)
    sku_snapshot = db.Column(db.String(100), nullable=True)
    unit_price_cents = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    line_total_cents = db.Column(db.Integer, nullable=False)

    order = db.relationship("Order", back_populates="items")
    product = db.relationship("Product", back_populates="order_items")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "product_name": self.product_name_snapshot,
            "sku": self.sku_snapshot,
            "unit_price_cents": self.unit_price_cents,
            "unit_price": self.unit_price_cents / 100.0,
            "quantity": self.quantity,
            "line_total_cents": self.line_total_cents,
            "line_total": self.line_total_cents / 100.0,
        }


class PaymentEvent(db.Model):
    """
    Raw Stripe webhook events tied to orders.
    Super useful when debugging payments in prod.
    """
    __tablename__ = "payment_events"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)

    stripe_event_id = db.Column(db.String(255), unique=True, index=True, nullable=False)
    event_type = db.Column(db.String(100), nullable=False)
    raw_json = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    order = db.relationship("Order", back_populates="payment_events")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "stripe_event_id": self.stripe_event_id,
            "event_type": self.event_type,
            "raw_json": self.raw_json,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
