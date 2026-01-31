from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from db import getConn
from functions import getUsername, parseBirthDate
from security import hash_password, verifyPassword, isPasswordValid, isEmailValid
from datetime import date

app = Flask(__name__, static_folder="UI", static_url_path="")
CORS(app)


@app.get("/")
def home():
    return send_from_directory("UI", "index.html")

def jsonError(msg, code=400, field=None):
    payload = {"ok": False, "error": msg}
    if field:
        payload["field"] = field
    
    return jsonify(payload), code

@app.get("/health")
def health():
    return jsonify({"ok": True})

@app.post("/register")
def register():
    data = request.get_json(silent=True) or {}

    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    confirmPW = data.get("confirmPW") or ""
    email = (data.get("email") or "").strip()
    birthdate = (data.get("birthdate") or "").strip()
    bd = parseBirthDate(birthdate)

    if username == "":
        return jsonError("Error: Username cannot be empty!", field="username")
    
    if not (6 <= len(username) <= 64):
        return jsonError("Error: Username length is too small or too big!", field="username")
    
    if not isPasswordValid(password):
        return jsonError("Error: Password is Invalid!", field="password")
    
    if confirmPW != password:
        return jsonError("Error: Password dosen't match!", field="confirmPW")
    
    if not isEmailValid(email):
        return jsonError("Error: Email is invalid!", field="email")
    
    if bd is None:
        return jsonError("Error: Select year, month and day!", field="birthdate")
    
    existing = getUsername(username)
    if existing is not None:
        return jsonError("Error: Username already existing!", 409)
    
    today = date.today()
    age = today.year - bd.year - ((today.month, today.day) < (bd.month, bd.day))
    pwHash = hash_password(password)

    conn = getConn()
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO users (username, password_hash, email, birth_date, age) VALUES (%s, %s, %s, %s, %s)", (username, pwHash, email, bd.isoformat(), age))
        conn.commit()
    
    finally:
        cursor.close()
        conn.close()

    return jsonify({
        "ok": True,
        "user": {"username": username, "email": email, "age": age}
    }), 201

@app.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not username:
        return jsonError("Error: Please enter you username!", field="username")
    
    if not password:
        return jsonError("Error: Please enter your password!", field="password")
    
    user = getUsername(username)
    if user is None:
        return jsonError("Error: This user dosen't exist!", 401)
    
    if not verifyPassword(password, user['password_hash']):
        return jsonError("Error: Invalid password! Try again", field="password")
    
    conn = getConn()
    cursor = conn.cursor()
    today = date.today()

    try: 
        cursor.execute("UPDATE users SET lastlogin = %s WHERE username = %s", today, user['username'])
        conn.commit()
    
    finally:
        cursor.close()
        conn.close()
    
    return jsonify({
        "ok": True,
        "user": {
            "id": user.get("id"),
            "username": user.get("username"),
            "email": user.get("email"),
            "age": user.get("age"),
        }
    })
    
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)