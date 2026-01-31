import bcrypt

def hash_password(password: str) -> str:
    pw_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pw_bytes, salt)
    return hashed.decode("utf-8")

def verifyPassword(password: str, stored_hash: str) -> bool:
    pw_bytes = password.encode("utf-8")
    hash_bytes = stored_hash.encode("utf-8")
    return bcrypt.checkpw(pw_bytes, hash_bytes)

def isPasswordValid(password):
    if not (8 <= len(password) <= 64):
        return False
    if not password[0].isupper():
        return False
    if not any(c.isdigit() for c in password):
        return False
    if not any(not c.isalnum() for c in password):
        return False
    if not password:
        return False
    
    return True

def isEmailValid(email):
    if len(email) > 320:
        return False
    if not email or "@" not in email:
        return False
    if email.count("@") != 1:
        return False
    local, domain = email.split("@")

    if not local or not domain:
        return False
    if "." not in domain:
        return False
    if domain.startswith(".") or domain.endswith("."):
        return False

    return True