`# Auth System (Flask + MySQL)

A simple authentication system built with Flask, MySQL and a browser-based UI.
The project demonstrates a complete auth flow: register and login, input validation,
password hashing, and proper HTTP error handling.

This is a **demo / entry-level project**, not a production-ready system.

---

## Features

- User registration and login
- Password hashing (bcrypt)
- Input validation (frontend + backend)
- REST API built with Flask
- MySQL database
- Clear HTTP status codes (400 / 401 / 409 / 200)
- Simple UI served directly by Flask

---

## Tech Stack

- Python 3
- Flask
- MySQL
- HTML / CSS / JavaScript (vanilla)
- bcrypt

---

## Project Structure
```
project/
├─ api.py # Flask backend (entry point)
├─ db.py # Database connection
├─ security.py # Password hashing & validation
├─ functions.py # Helper functions
├─ UI/
│ ├─ index.html
│ ├─ style.css
│ └─ app.js
├─ .gitignore
└─ README.md
```

---

## Database Schema (simplified)

Example `users` table:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  age INT,
  lastlogin DATE,
  RegisterDate DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
---

## Setup & Run
1. Clone the repository
git clone <repo-url>
cd <project-folder>

2. Create and activate virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate

3. Install dependencies
pip install flask flask-cors mysql-connector-python bcrypt

4. Configure database
Edit db.py with your MySQL credentials and make sure the database and tables exist.

5. Run the application
python api.py

Open in browser:
http://127.0.0.1:8000/

---

## API Endpoints

POST /register

Registers a new user.
Request body
{
  "username": "testuser",
  "password": "password123",
  "confirmPW": "password123",
  "email": "test@email.com",
  "birthday": "2000-01-01"
}

POST /login
Authenticates a user.

Request body

{
  "username": "testuser",
  "password": "password123"
}

Responses
200 OK – login successful
400 Bad Request – missing/invalid input
401 Unauthorized – invalid credentials
409 Conflict – username already exists

---

## Notes / Limitations

No email verification (intentionally omitted)
No session or JWT handling
No rate limiting or brute-force protection
Credentials are stored locally (not environment-based)
These are considered future improvements, not bugs.

---

## Future Improvements

Email verification
JWT or session-based authentication
Environment-based configuration (.env)
Rate limiting
Better UI/UX feedback

---

## Disclaimer

This project is meant for learning and demonstration purposes.
Do not use as-is in production.
