import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function ScorePage() {
  const location = useLocation();
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { score, total } = location.state || { score: 0, total: 0 };

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px 60px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          textAlign: "center",
          width: "350px",
        }}
      >
        <h2 style={{ color: "#333", marginBottom: "10px" }}>Quiz Completed!</h2>
        <p style={{ fontSize: "18px", color: "#555", marginBottom: "20px" }}>
          Your Score:{" "}
          <strong style={{ color: "#007bff" }}>
            {score} / {total}
          </strong>
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={() => navigate(`/leaderboard/${quizId}`)}
            style={{
              padding: "8px 14px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            View Leaderboard
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "8px 14px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
