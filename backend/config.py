import mysql.connector

def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",         # your MySQL username
        password="Nishu@1412",  # your MySQL password
        database="quiz_db"
    )
    return conn
