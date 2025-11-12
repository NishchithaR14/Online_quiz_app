import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function AddQuestion() {
  const { quizId } = useParams();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState({ a: "", b: "", c: "", d: "" });
  const [correct, setCorrect] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/question", {
        quiz_id: quizId,
        question_text: question,
        option_a: options.a,
        option_b: options.b,
        option_c: options.c,
        option_d: options.d,
        correct_answer: correct,
      });
      setMessage("✅ Question added successfully!");
      setQuestion("");
      setOptions({ a: "", b: "", c: "", d: "" });
      setCorrect("");
    } catch (err) {
      setMessage("❌ Failed to add question");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>➕ Add Question (Quiz ID: {quizId})</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter question text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          style={{ width: "70%", height: "80px", margin: "10px 0", padding: "10px" }}
        ></textarea>
        {["a", "b", "c", "d"].map((opt) => (
          <input
            key={opt}
            type="text"
            placeholder={`Option ${opt.toUpperCase()}`}
            value={options[opt]}
            onChange={(e) => setOptions({ ...options, [opt]: e.target.value })}
            required
            style={{ display: "block", width: "70%", margin: "8px auto", padding: "8px" }}
          />
        ))}
        <input
          type="text"
          placeholder="Correct Answer (a/b/c/d)"
          value={correct}
          onChange={(e) => setCorrect(e.target.value)}
          required
          style={{ display: "block", width: "70%", margin: "10px auto", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px", marginTop: "10px" }}>
          Add Question
        </button>
      </form>
      <p>{message}</p>
      <button onClick={() => navigate("/admin/dashboard")} style={{ marginTop: "15px" }}>
        🔙 Back to Dashboard
      </button>
    </div>
  );
}

export default AddQuestion;
