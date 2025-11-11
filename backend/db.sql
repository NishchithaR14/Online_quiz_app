CREATE DATABASE IF NOT EXISTS quiz_db;
USE quiz_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(120) UNIQUE,
    phone_number VARCHAR(15) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    adminname VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(120) UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE quizzes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    created_by BIGINT,
    time_limit_seconds INT DEFAULT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    option1 VARCHAR(255),
    option2 VARCHAR(255),
    option3 VARCHAR(255),
    option4 VARCHAR(255),
    correct_option INT CHECK (correct_option BETWEEN 1 AND 4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS  results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    quiz_id BIGINT NOT NULL,
    score INT DEFAULT 0,
    total_questions INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE result_answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    result_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_option INT,
    is_correct BOOLEAN,
    FOREIGN KEY (result_id) REFERENCES results(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

USE quiz_db;
SELECT * FROM users;
SELECT * FROM admin;
SELECT * FROM quizzes;
SELECT * FROM questions;
SELECT * FROM results;

UPDATE users SET password_hash = 'nish123' WHERE email = 'nish@example.com';
UPDATE admin SET password_hash = 'admin123' WHERE email = 'admin@example.com';

INSERT INTO admin (adminname, email, password_hash)
VALUES ('admin', 'admin@example.com', 'scrypt:32768:8:1$H9G0TMTwOjW6GC1c$223c08163948e25daa37275310414d710c240360a1ae9b9c3fcfc0decc678a225b2b618f2a34f4921814f5af32ffbf87809d2f3fd3b48dd9b9a337e633479187');

ALTER TABLE users MODIFY phone_number VARCHAR(15) NOT NULL;

