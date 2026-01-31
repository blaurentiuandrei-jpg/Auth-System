from db import getConn
from datetime import date

SPECIAL_CHARS = "!@#$%^&*()-_=+[]{}|;:',.<>?/"

def has_number(string):
    return any(c.isdigit() for c in string)

def has_special_char(string):
    return any(c in SPECIAL_CHARS for c in string)

def getUsername(username):
    conn = getConn()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE username = %s LIMIT 1", (username,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()
    return user

def parseBirthDate(bdate: str):
    try:
        y, m, d = map(int, bdate.strip().split("-"))
        bd = date(y, m, d)
    except Exception:
        return None
    
    if bd > date.today():
        return None
    
    if(date.today().year - bd.year) > 120:
        return None
    
    return bd