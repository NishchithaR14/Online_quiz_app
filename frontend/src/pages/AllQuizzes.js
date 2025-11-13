import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AllQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editQuestion, setEditQuestion] = useState(null);
  const [leaderboards, setLeaderboards] = useState({}); // <-- new state
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/quizzes");
      setQuizzes(res.data);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    }
  };

  const handleViewTest = async (quizId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/question/${quizId}`);
      setQuestions(res.data);
      setSelectedQuizId(quizId);
      setEditQuestion(null);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const handleViewLeaderboard = async (quizId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/leaderboard/${quizId}`);
      setLeaderboards(prev => ({ ...prev, [quizId]: res.data }));
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      await axios.delete(`http://127.0.0.1:5000/question/${questionId}`);
      setQuestions(questions.filter((q) => q.id !== questionId));
      alert("Question deleted successfully!");
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/question/${editQuestion.id}`, editQuestion);
      alert("Question updated successfully!");
      handleViewTest(selectedQuizId); 
      setEditQuestion(null);
    } catch (err) {
      console.error("Error updating question:", err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center" }}>All Quizzes</h2>

      {quizzes.length === 0 ? (
        <p style={{ textAlign: "center" }}>No quizzes created yet.</p>
      ) : (
        quizzes.map((quiz) => (
          <div
            key={quiz.id}
            style={{
              background: "#f8f9fa",
              margin: "20px auto",
              padding: "20px",
              borderRadius: "10px",
              width: "80%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{quiz.title}</h3>
            <p><strong>Description:</strong> {quiz.description}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                onClick={() => navigate(`/admin/add-question/${quiz.id}`)}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                + Add Question
              </button>

              <button
                onClick={() => handleViewTest(quiz.id)}
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                View Test
              </button>

              {/* Leaderboard button */}
              <button
                onClick={() => handleViewLeaderboard(quiz.id)}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                View Leaderboard
              </button>
            </div>

            {/* Display Leaderboard */}
            {leaderboards[quiz.id] && (
              <div style={{ marginTop: "20px", background: "#fff", padding: "15px", borderRadius: "10px", border: "1px solid #ccc" }}>
                <h4>Leaderboard</h4>
                <table border="1" cellPadding="5" style={{ width: "100%", textAlign: "left" }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Score</th>
                      <th>Total Questions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboards[quiz.id].map((user, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.score}</td>
                        <td>{user.total_questions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Display questions */}
            {selectedQuizId === quiz.id && (
              <div
                style={{
                  marginTop: "20px",
                  background: "#fff",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              >
                <h4>Questions:</h4>
                {questions.length > 0 ? (
                  <ul>
                    {questions.map((q, index) => (
                      <li key={q.id} style={{ marginBottom: "15px" }}>
                        {editQuestion && editQuestion.id === q.id ? (
                          <div style={{ background: "#f1f1f1", padding: "10px", borderRadius: "8px" }}>
                            <input
                              type="text"
                              value={editQuestion.question_text}
                              onChange={(e) =>
                                setEditQuestion({ ...editQuestion, question_text: e.target.value })
                              }
                              placeholder="Enter question"
                              style={{ width: "100%", marginBottom: "8px" }}
                            />
                            {[1, 2, 3, 4].map((num) => (
                              <input
                                key={num}
                                type="text"
                                value={editQuestion[`option${num}`]}
                                onChange={(e) =>
                                  setEditQuestion({ ...editQuestion, [`option${num}`]: e.target.value })
                                }
                                placeholder={`Option ${num}`}
                                style={{ width: "100%", marginBottom: "8px" }}
                              />
                            ))}
                            <input
                              type="number"
                              value={editQuestion.correct_option}
                              onChange={(e) =>
                                setEditQuestion({ ...editQuestion, correct_option: e.target.value })
                              }
                              placeholder="Correct Option (1-4)"
                              style={{ width: "100%", marginBottom: "8px" }}
                            />
                            <div style={{ display: "flex", gap: "10px" }}>
                              <button onClick={handleEditSave}>Save</button>
                              <button onClick={() => setEditQuestion(null)}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <strong>Q{index + 1}:</strong> {q.question_text}
                            <ul>
                              <li>A: {q.option1}</li>
                              <li>B: {q.option2}</li>
                              <li>C: {q.option3}</li>
                              <li>D: {q.option4}</li>
                              <li>Correct: Option {q.correct_option}</li>
                            </ul>
                            <button
                              onClick={() => setEditQuestion(q)}
                              style={{
                                marginRight: "10px",
                                backgroundColor: "#ffc107",
                                border: "none",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(q.id)}
                              style={{
                                backgroundColor: "#dc3545",
                                border: "none",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                color: "white",
                              }}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No questions found.</p>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AllQuizzes;
