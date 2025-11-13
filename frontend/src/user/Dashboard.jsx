import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // {id, username, role}

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/quizzes")
      .then((res) => setQuizzes(res.data))
      .catch((err) => console.log(err));
  }, []);

  const startQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#eef2f3",
        padding: "40px 20px",
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#ffffff",
          padding: "15px 25px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          marginBottom: "30px",
          maxWidth: "900px",
          marginInline: "auto",
        }}
      >
        <h2 style={{ margin: 0, color: "#333" }}>
          Welcome, {user?.username || "User"}
        </h2>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ff4b5c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      {/* Quiz List */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "25px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#222",
            borderBottom: "2px solid #ddd",
            paddingBottom: "10px",
          }}
        >
          Available Quizzes
        </h3>

        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div
              key={quiz.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "6px",
                padding: "15px 20px",
                marginBottom: "15px",
                backgroundColor: "#fafafa",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f1f1f1")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fafafa")
              }
            >
              <h4 style={{ margin: "0 0 8px", color: "#333" }}>{quiz.title}</h4>
              <p style={{ margin: "0 0 10px", color: "#555" }}>
                {quiz.description}
              </p>
              <button
                onClick={() => startQuiz(quiz.id)}
                style={{
                  padding: "8px 14px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Start Quiz
              </button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>
            No quizzes available right now.
          </p>
        )}
      </div>
    </div>
  );
}
