import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminUserView() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
  });

  const navigate = useNavigate();

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/user/${id}`);
        setUser(res.data);
        setFormData({
          username: res.data.username || "",
          email: res.data.email || "",
          phone_number: res.data.phone_number || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save edits (PUT request)
  const handleSave = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/user/${id}`, formData);
      alert("User updated successfully!");
      setEditing(false);
      setUser({ ...user, ...formData });
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user");
    }
  };

  // Delete user
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/user/${id}`);
        alert("🗑 User deleted successfully!");
        navigate("/admin/dashboard");
      } catch (err) {
        console.error("Error deleting user:", err);
        alert(" Failed to delete user");
      }
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>⏳ Loading user...</p>;
  }

  if (!user || user.error) {
    return <p style={{ textAlign: "center", color: "red" }}>User not found.</p>;
  }

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>👤 User Details</h2>

      <div
        style={{
          display: "inline-block",
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          textAlign: "left",
          minWidth: "300px",
        }}
      >
        {editing ? (
          <>
            <p>
              <strong>Username:</strong>{" "}
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={{ width: "100%", padding: "5px" }}
              />
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ width: "100%", padding: "5px" }}
              />
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                style={{ width: "100%", padding: "5px" }}
              />
            </p>
            <button
              onClick={handleSave}
              style={{
                background: "#28a745",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{
                background: "#6c757d",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone_number || "N/A"}
            </p>
            <p>
              <strong>Total Quizzes:</strong> {user.total_quizzes || 0}
            </p>
            <p>
              <strong>Total Score:</strong> {user.total_score || 0}
            </p>

            <button
              onClick={() => setEditing(true)}
              style={{
                background: "#007bff",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              style={{
                background: "#dc3545",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
}

export default AdminUserView;
