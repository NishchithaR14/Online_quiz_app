from flask import Flask, request, jsonify
from flask_cors import CORS
from config import get_db_connection

app = Flask(__name__)
CORS(app)

# -------------------------
# 🧍 USER & ADMIN REGISTER/LOGIN (Plain Passwords)
# -------------------------
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    phone_number = str(data.get('phone_number'))
    password = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO users (username, email, phone_number, password_hash)
            VALUES (%s, %s, %s, %s)
        """, (username, email, phone_number, password))  # store plain password
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        print("❌ Registration error:", e)   # <--- ADD THIS LINE
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()


@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM users WHERE email = %s AND password_hash = %s", (email, password))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user:
        return jsonify({"message": "User login successful", "user": user}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@app.route('/admin/login', methods=['POST'])
def login_admin():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM admin WHERE email = %s AND password_hash = %s", (email, password))
    admin = cur.fetchone()
    cur.close()
    conn.close()

    if admin:
        return jsonify({"message": "Admin login successful", "admin": admin}), 200
    else:
        return jsonify({"error": "Invalid admin credentials"}), 401


@app.route('/')
def home():
    return "✅ Flask Quiz App Backend is Running Normally (No Hashing)"


if __name__ == '__main__':
    app.run(debug=True)
