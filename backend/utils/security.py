import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Any, Dict
from ..config import JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRES

def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(identity: str) -> str:
    now = datetime.utcnow()
    payload: Dict[str, Any] = {
        "sub": identity,
        "iat": now,
        "exp": now + ACCESS_TOKEN_EXPIRES,
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> Dict[str, Any]:
    return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
