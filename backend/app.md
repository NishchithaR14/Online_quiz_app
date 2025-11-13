from flask import Flask, request, jsonify
from flask_cors import CORS
from config import get_db_connection  # your MySQL connector setup

app = Flask(__name__)
CORS(app)

# ---------------------- USER REGISTRATION ----------------------
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
        """, (username, email, phone_number, password))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        print("❌ Registration error:", e)
        return jsonify({"error": str(e)}), 400
    finally:
        cur.close()
        conn.close()

# # ---------------------- LOGIN (USER / ADMIN) ----------------------
# @app.route('/login', methods=['POST'])
# def login():
#     data = request.json
#     email = data.get('email')
#     password = data.get('password')

#     conn = get_db_connection()
#     cur = conn.cursor(dictionary=True)

#     # Try user login
#     cur.execute("SELECT * FROM users WHERE email=%s AND password_hash=%s", (email, password))
#     user = cur.fetchone()

#     if not user:
#         # Try admin login
#         cur.execute("SELECT * FROM admin WHERE email=%s AND password_hash=%s", (email, password))
#         admin = cur.fetchone()
#         if admin:
#             role = 'admin'
#             result = admin
#         else:
#             role = None
#             result = None
#     else:
#         role = 'user'
#         result = user

#     cur.close()
#     conn.close()

#     if result:
#         return jsonify({"message": "Login successful", "role": role}), 200
#     else:
#         return jsonify({"error": "Invalid credentials"}), 401


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    # Try user login
    cur.execute("SELECT * FROM users WHERE email=%s AND password_hash=%s", (email, password))
    user = cur.fetchone()

    if user:
        role = 'user'
        result = user
        response = {
            "message": "Login successful",
            "role": role,
            "user": {
                "id": result['id'],
                "username": result['username']
            }
        }
    else:
        # Try admin login
        cur.execute("SELECT * FROM admin WHERE email=%s AND password_hash=%s", (email, password))
        admin = cur.fetchone()
        if admin:
            role = 'admin'
            response = {
                "message": "Login successful",
                "role": role
            }
        else:
            cur.close()
            conn.close()
            return jsonify({"error": "Invalid credentials"}), 401

    cur.close()
    conn.close()
    return jsonify(response), 200


# ---------------------- FETCH ALL USERS ----------------------
@app.route('/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, username, email FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)

# ---------------------- CREATE QUIZ ----------------------
@app.route('/create_quiz', methods=['POST'])
def create_quiz():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title or not description:
        return jsonify({'error': 'Missing fields'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO quizzes (title, description) VALUES (%s, %s)", (title, description))
        conn.commit()
        quiz_id = cur.lastrowid
        cur.close()
        conn.close()
        return jsonify({'message': 'Quiz created successfully', 'quiz_id': quiz_id}), 201
    except Exception as e:
        print("❌ Quiz creation error:", e)
        return jsonify({'error': str(e)}), 500

@app.route('/question', methods=['POST'])
def add_question():
    data = request.json
    quiz_id = data.get('quiz_id')
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

@app.route('/quizzes', methods=['GET'])
def get_quizzes():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, title, description, time_limit_seconds FROM quizzes")
    quizzes = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(quizzes)
    
# ---------------------- GET QUESTIONS FOR A QUIZ ----------------------
@app.route('/question/<int:quiz_id>', methods=['GET'])
def get_questions(quiz_id):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM questions WHERE quiz_id = %s", (quiz_id,))
    questions = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(questions)

# 📝 Update a question
@app.route('/question/<int:question_id>', methods=['PUT'])
def update_question(question_id):
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
        UPDATE questions 
        SET question_text=%s, option1=%s, option2=%s, option3=%s, option4=%s, correct_option=%s 
        WHERE id=%s
    """, (question_text, option1, option2, option3, option4, correct_option, question_id))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Question updated successfully"}), 200


# ❌ Delete a question
@app.route('/question/<int:question_id>', methods=['DELETE'])
def delete_question(question_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM questions WHERE id = %s", (question_id,))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Question deleted successfully"}), 200

@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, username, email, phone_number FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user)




# ✅ Update user
@app.route('/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    phone = data.get('phone_number')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE users
        SET username=%s, email=%s, phone_number=%s
        WHERE id=%s
    """, (username, email, phone, user_id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "User updated successfully"})


# ✅ Delete user
@app.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "User deleted successfully"})

@app.route('/submit/<int:quiz_id>', methods=['POST'])
def submit_quiz(quiz_id):
    data = request.json
    user_id = data.get('user_id')
    answers = data.get('answers')  # {"question_id": selected_option}

    if not user_id or not answers:
        return jsonify({"error": "Missing data"}), 400

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    # Fetch questions for the quiz
    cur.execute("SELECT id, correct_option FROM questions WHERE quiz_id = %s", (quiz_id,))
    questions = cur.fetchall()

    score = 0
    total = len(questions)

    # Insert into results table
    cur.execute("INSERT INTO results (user_id, quiz_id, total_questions) VALUES (%s, %s, %s)", (user_id, quiz_id, total))
    result_id = cur.lastrowid

    # Save each answer
    for q in questions:
        qid = q['id']
        correct = q['correct_option']
        selected = answers.get(str(qid))
        is_correct = selected == correct
        if is_correct:
            score += 1
        cur.execute("""
            INSERT INTO result_answers (result_id, question_id, selected_option, is_correct)
            VALUES (%s, %s, %s, %s)
        """, (result_id, qid, selected, is_correct))

    # Update score in results table
    cur.execute("UPDATE results SET score=%s WHERE id=%s", (score, result_id))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"score": score, "total_questions": total})
@app.route('/leaderboard/<int:quiz_id>', methods=['GET'])
def leaderboard(quiz_id):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT u.username, r.score, r.total_questions
        FROM results r
        JOIN users u ON r.user_id = u.id
        WHERE r.quiz_id = %s
        ORDER BY r.score DESC
        LIMIT 10
    """, (quiz_id,))

    leaders = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(leaders)


# ---------------------- ROOT CHECK ----------------------
@app.route('/')
def home():
    return "✅ Quiz App Backend is Running Normally"

# ---------------------- MAIN ----------------------
if __name__ == '__main__':
    app.run(debug=True)
