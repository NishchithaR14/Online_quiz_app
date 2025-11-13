import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/create_quiz", {
        title,
        description,
      });

      if (res.status === 201) {
        setMessage("✅ Quiz created successfully!");
        // Navigate to add-question page with quiz_id
        const quizId = res.data.quiz_id;
        setTimeout(() => {
          navigate(`/admin/add-question/${quizId}`);
        }, 1000);
      }
    } catch (err) {
      console.error("❌ Error creating quiz:", err);
      setMessage("❌ Failed to create quiz");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h2>🧩 Create New Quiz</h2>

      <form
        onSubmit={handleCreateQuiz}
        style={{
          width: "400px",
          margin: "20px auto",
          textAlign: "left",
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <label>Quiz Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter quiz title"
          style={{
            display: "block",
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
          }}
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Short description..."
          style={{
            display: "block",
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ➕ Create Quiz
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

export default CreateQuiz;
