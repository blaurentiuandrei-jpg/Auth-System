from db import connectionDatabase
from functions import getUsername
from auth_service import registerUser, loginUser

def main():
    if connectionDatabase() is False:
        return False
    
    username_input = input("Username: ")
    user = getUsername(username_input)

    if user is None:
        registerUser(username_input)

    else:
        loginUser(user)

main()