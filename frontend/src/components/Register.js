import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5000/register', {
        username,
        email,
        phone_number,
        password,
      });
      setMessage(res.data.message || "✅ Registered successfully!");
    } catch (err) {
      setMessage("❌ Registration failed");
    }
  };

  return (
    <div style={{ width: "400px", margin: "100px auto", textAlign: "center" }}>
      <h2>User Registration</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: "8px", width: "80%" }}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: "8px", width: "80%" }}
        />
        <input
          type="text"
          placeholder="Phone Number"
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: "8px", width: "80%" }}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", margin: "10px auto", padding: "8px", width: "80%" }}
        />

        {/* 🔹 Two buttons side by side */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "80%",
            margin: "15px auto",
          }}
        >
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "8px 16px",
              marginRight: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              flex: 1,
              padding: "8px 16px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </div>
      </form>

      <p style={{ marginTop: "10px" }}>{message}</p>
    </div>
  );
}

export default Register;
