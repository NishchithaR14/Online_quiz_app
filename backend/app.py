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
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    # Check in users
    cur.execute("SELECT * FROM users WHERE email=%s AND password_hash=%s", (email, password))
    user = cur.fetchone()

    # If not found, check in admin
    if not user:
        cur.execute("SELECT * FROM admin WHERE email=%s AND password_hash=%s", (email, password))
        admin = cur.fetchone()
        if admin:
            role = 'admin'
            result = admin
        else:
            role = None
            result = None
    else:
        role = 'user'
        result = user

    cur.close()
    conn.close()

    if result:
        return jsonify({"message": "Login successful", "role": role}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# @app.route('/users', methods=['GET'])
# def get_users():
#     try:
#         conn = get_db_connection()
#         cursor = conn.cursor(dictionary=True)
#         cursor.execute("SELECT id, username, email, phone_number, Time FROM users")
#         users = cursor.fetchall()
#         cursor.close()
#         conn.close()

#         return jsonify(users)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@app.route('/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, username, email FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)

# -------------------------
# 🧩 QUESTIONS
# -------------------------

@app.route('/question', methods=['POST'])
def add_question():
    data = request.json
    quiz_id = data.get('quiz_id')
    question_text = data.get('question_text')
    option_a = data.get('option_a')
    option_b = data.get('option_b')
    option_c = data.get('option_c')
    option_d = data.get('option_d')
    correct_answer = data.get('correct_answer')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Question added successfully"}), 201

@app.route('/create_quiz', methods=['POST'])
def create_quiz():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title or not description:
        return jsonify({'error': 'Missing fields'}), 400

    conn = mysql.connection
    cursor = conn.cursor()
    cursor.execute("INSERT INTO quizzes (title, description) VALUES (%s, %s)", (title, description))
    conn.commit()

    quiz_id = cursor.lastrowid
    cursor.close()

    return jsonify({'message': 'Quiz created successfully', 'quiz_id': quiz_id})


@app.route('/question/<int:quiz_id>', methods=['GET'])
def get_questions(quiz_id):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM questions WHERE quiz_id = %s", (quiz_id,))
    questions = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(questions)



@app.route('/')
def home():
    return "✅ Flask Quiz App Backend is Running Normally (No Hashing)"


if __name__ == '__main__':
    app.run(debug=True)
