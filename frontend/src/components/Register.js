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
    setMessage('');
    try {
      const res = await axios.post('http://127.0.0.1:5000/register', {
        username,
        email,
        phone_number,
        password,
      });
      setMessage(res.data.message || "Registered successfully!");
    } catch (err) {
      setMessage("Registration failed. Try again.");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        width: "380px",
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 15px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none"
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 15px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none"
            }}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone_number}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 15px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none"
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 15px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none"
            }}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#4CAF50",
                color: "#fff",
                fontSize: "16px",
                cursor: "pointer",
                transition: "0.3s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"}
            >
              Register
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#2196F3",
                color: "#fff",
                fontSize: "16px",
                cursor: "pointer",
                transition: "0.3s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#1976D2"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#2196F3"}
            >
              Login
            </button>
          </div>
        </form>

        {message && <p style={{ color: "red", textAlign: "center", marginTop: "15px" }}>{message}</p>}
      </div>
    </div>
  );
}

export default Register;
