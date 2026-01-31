from db import getConn
from functions import parseBirthDate, date
from security import hash_password, isPasswordValid, verifyPassword, isEmailValid
import random

def registerUser(user):
    language = input(f"You don't have an account, {user}, first time select your language (RO/EN): ").strip().upper()
    while True:
        if(len(language) != 2):
            language = input("Invalid language (RO/EN): ").strip().upper()
            continue
        if language not in ("RO", "EN"):
            language = input("Invalid language (RO/EN): ").strip().upper()
            continue
        break
        
    password = input(f"Create a password: ")
    while True:
        if not isPasswordValid(password):
            password = input(f"Your password is invalid: ")
            continue
        break

    email = input('Please type your addres email:')
    while True:
        if not isEmailValid(email):
            email = input('Your email is not valid: ')
            continue
        break

    birthdate_input = input('Enter your birth day (YYYY-MM-DD):')
    while True:
        bd = parseBirthDate(birthdate_input)
        if bd is None:
            birthdate_input = input('Invalid format (YYYY-MM-DD): ')
            continue
        break

    password_hash = hash_password(password)
    bdstring = bd.isoformat()
    today = date.today()
    age = today.year - bd.year - ((today.month, today.day) < (bd.month, bd.day))
                
    conn = getConn()
    cursor = conn.cursor()
        
    cursor.execute("INSERT INTO users (username, password_hash, email, birth_date, age) VALUES (%s, %s, %s, %s, %s)", (user, password_hash, email, bdstring, age))
    conn.commit()

    cursor.close()
    conn.close()

    print(f"{user} you succesfully registered, your email is {email} and you have {age} years old.")

def loginUser(user):
    i = 3
    while i > 0:
        password_input = input('To login type the password of your account: ')
        if verifyPassword(password_input, user['password_hash']):
            print(f"You logged succesfuly, {user['username']}.")
            break
        else:
            i -= 1
            if i == 0:
                print("Account locked. Too many attempts")
            else:
                print(f"Your password dosen't match to your account. Try again you have {i} tries left: ")