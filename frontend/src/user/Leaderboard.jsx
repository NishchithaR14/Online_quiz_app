import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Leaderboard() {
  const { quizId } = useParams();
  const [leaders, setLeaders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/leaderboard/${quizId}`)
      .then((res) => setLeaders(res.data))
      .catch((err) => console.log(err));
  }, [quizId]);

  useEffect(() => {
  axios
    .get(`http://127.0.0.1:5000/leaderboard/${quizId}`)
    .then((res) => {
      // Remove duplicate users, keeping the highest score
      const uniqueLeaders = Object.values(
        res.data.reduce((acc, curr) => {
          if (!acc[curr.username] || acc[curr.username].score < curr.score) {
            acc[curr.username] = curr;
          }
          return acc;
        }, {})
      );
      setLeaders(uniqueLeaders);
    })
    .catch((err) => console.log(err));
}, [quizId]);

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center" }}>Leaderboard</h2>

      <div
        style={{
          margin: "20px auto",
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "10px",
          width: "80%",
          padding: "20px",
        }}
      >
        {leaders.length > 0 ? (
          <table
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
            }}
          >
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
                <th>Total Questions</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((l, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{l.username}</td>
                  <td>{l.score}</td>
                  <td>{l.total_questions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", color: "#555" }}>
            No scores available yet.
          </p>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
