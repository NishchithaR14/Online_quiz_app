import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function AddQuestion() {
  const { quizId } = useParams(); // get quiz_id from URL
  const [questionText, setQuestionText] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctOption, setCorrectOption] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAddQuestion = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:5000/question", {
        quiz_id: quizId,
        question_text: questionText,
        option1,
        option2,
        option3,
        option4,
        correct_option: parseInt(correctOption),
      });

      if (res.status === 201) {
        setMessage("Question added successfully!");
        // clear form after submission
        setQuestionText("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
        setCorrectOption("");
      }
    } catch (err) {
      console.error("Error adding question:", err);
      setMessage("Failed to add question");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h2>Add Questions to Quiz (ID: {quizId})</h2>

      <form
        onSubmit={handleAddQuestion}
        style={{
          width: "500px",
          margin: "20px auto",
          textAlign: "left",
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <label>Question Text</label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
          }}
        />

        <label>Option 1</label>
        <input
          type="text"
          value={option1}
          onChange={(e) => setOption1(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <label>Option 2</label>
        <input
          type="text"
          value={option2}
          onChange={(e) => setOption2(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <label>Option 3</label>
        <input
          type="text"
          value={option3}
          onChange={(e) => setOption3(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <label>Option 4</label>
        <input
          type="text"
          value={option4}
          onChange={(e) => setOption4(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <label>Correct Option (1 - 4)</label>
        <input
          type="number"
          min="1"
          max="4"
          value={correctOption}
          onChange={(e) => setCorrectOption(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "15px", padding: "8px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Question
        </button>
      </form>

      <p>{message}</p>

      <button
        onClick={() => navigate("/admin/dashboard")}
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}

export default AddQuestion;
