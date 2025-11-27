from datetime import datetime
from .extensions import db, bcrypt


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=True)

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

    store = db.relationship("Store", back_populates="products")

    def to_dict(self):
        return {
            "id": self.id,
            "store_id": self.store_id,
            "name": self.name,
            "sku": self.sku,
            "price_cents": self.price_cents,
            "price": self.price_cents / 100.0,
            "image_url": self.image_url,
            "description": self.description,
            "active": self.active,
        }


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    store_id = db.Column(db.Integer, db.ForeignKey("stores.id"), nullable=False)
    stripe_payment_intent_id = db.Column(db.String(255), nullable=True)
    customer_email = db.Column(db.String(255), nullable=True)
    customer_name = db.Column(db.String(255), nullable=True)
    total_cents = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default="pending")  # pending, paid, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    store = db.relationship("Store", back_populates="orders")

    def to_dict(self):
        return {
            "id": self.id,
            "store_id": self.store_id,
            "stripe_payment_intent_id": self.stripe_payment_intent_id,
            "customer_email": self.customer_email,
            "customer_name": self.customer_name,
            "total_cents": self.total_cents,
            "total": self.total_cents / 100.0,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }
