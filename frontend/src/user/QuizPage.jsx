import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function QuizPage() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/question/${quizId}`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.log(err));
  }, [quizId]);

  const handleChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: parseInt(value) });
  };

  const handleSubmit = () => {
    axios
      .post(`http://127.0.0.1:5000/submit/${quizId}`, {
        user_id: user.id,
        answers,
      })
      .then((res) => {
        navigate(`/score/${quizId}`, {
          state: { score: res.data.score, total: res.data.total_questions },
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>
          Quiz
        </h2>

        {questions.length > 0 ? (
          questions.map((q, index) => (
            <div
              key={q.id}
              style={{
                marginBottom: "20px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                padding: "15px 20px",
                backgroundColor: "#fdfdfd",
              }}
            >
              <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
                {index + 1}. {q.question_text}
              </p>
              {[1, 2, 3, 4].map((i) => (
                <label
                  key={i}
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={i}
                    onChange={() => handleChange(q.id, i)}
                    checked={answers[q.id] === i}
                    style={{ marginRight: "8px" }}
                  />
                  {q[`option${i}`]}
                </label>
              ))}
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>Loading quiz...</p>
        )}

        {questions.length > 0 && (
          <button
            onClick={handleSubmit}
            style={{
              display: "block",
              margin: "20px auto 0",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}
