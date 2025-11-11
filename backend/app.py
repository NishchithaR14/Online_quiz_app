from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
from config import get_db_connection

app = Flask(__name__)
CORS(app)  # Allow frontend (React) to call backend

# -------------------------
# 🧍 USER & ADMIN REGISTER/LOGIN
# -------------------------
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    phone_number = data.get('phone_number')
    password = data.get('password')

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO users (username, email, phone_number, password_hash)
            VALUES (%s, %s, %s, %s)
        """, (username, email, phone_number, hashed_pw))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
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
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({"message": "Login successful", "user": user}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@app.route('/admin/login', methods=['POST'])
def login_admin():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM admin WHERE email = %s", (email,))
    admin = cur.fetchone()
    cur.close()
    conn.close()

    if admin and bcrypt.checkpw(password.encode('utf-8'), admin['password_hash'].encode('utf-8')):
        return jsonify({"message": "Admin login successful", "admin": admin}), 200
    else:
        return jsonify({"error": "Invalid admin credentials"}), 401


# -------------------------
# 🧩 QUIZZES & QUESTIONS
# -------------------------
@app.route('/quizzes', methods=['GET'])
def get_quizzes():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM quizzes")
    quizzes = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(quizzes)


@app.route('/quiz', methods=['POST'])
def create_quiz():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    created_by = data.get('created_by')
    time_limit = data.get('time_limit_seconds')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO quizzes (title, description, created_by, time_limit_seconds)
        VALUES (%s, %s, %s, %s)
    """, (title, description, created_by, time_limit))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Quiz created successfully"}), 201


@app.route('/quiz/<int:quiz_id>/questions', methods=['POST'])
def add_question(quiz_id):
    data = request.json
    question_text = data.get('question_text')
    option1 = data.get('option1')
    option2 = data.get('option2')
    option3 = data.get('option3')
    option4 = data.get('option4')
    correct_option = data.get('correct_option')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO questions (quiz_id, question_text, option1, option2, option3, option4, correct_option)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (quiz_id, question_text, option1, option2, option3, option4, correct_option))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Question added successfully"}), 201


@app.route('/quiz/<int:quiz_id>/questions', methods=['GET'])
def get_questions(quiz_id):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM questions WHERE quiz_id = %s", (quiz_id,))
    questions = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(questions)


# -------------------------
# 🧮 RESULTS
# -------------------------
@app.route('/submit-quiz', methods=['POST'])
def submit_quiz():
    data = request.json
    user_id = data.get('user_id')
    quiz_id = data.get('quiz_id')
    answers = data.get('answers')  # list of {question_id, selected_option}

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    # Get correct answers
    cur.execute("SELECT id, correct_option FROM questions WHERE quiz_id = %s", (quiz_id,))
    question_data = {q['id']: q['correct_option'] for q in cur.fetchall()}

    score = 0
    total = len(answers)

    # Insert into results
    cur.execute("INSERT INTO results (user_id, quiz_id, score, total_questions) VALUES (%s, %s, %s, %s)",
                (user_id, quiz_id, 0, total))
    result_id = cur.lastrowid

    # Check answers
    for ans in answers:
        q_id = ans['question_id']
        selected = ans['selected_option']
        is_correct = selected == question_data.get(q_id)
        if is_correct:
            score += 1

        cur.execute("""
            INSERT INTO result_answers (result_id, question_id, selected_option, is_correct)
            VALUES (%s, %s, %s, %s)
        """, (result_id, q_id, selected, is_correct))

    # Update score
    cur.execute("UPDATE results SET score = %s WHERE id = %s", (score, result_id))
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({"message": "Quiz submitted", "score": score, "total": total}), 200

@app.route('/')
def home():
    return "✅ Flask Quiz App Backend is Running!"


if __name__ == '__main__':
    app.run(debug=True)
