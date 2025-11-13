import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://127.0.0.1:5000/login', { email, password });

      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.data.role === "user") {
        localStorage.setItem("user", JSON.stringify({
          id: res.data.user.id,
          username: res.data.user.username,
          role: "user"
        }));
        navigate("/dashboard");
      } else {
        setMessage("Unknown role");
      }

    } catch (err) {
      if (err.response && err.response.status === 401) {
        setMessage("Invalid credentials");
      } else {
        setMessage("Something went wrong. Try again.");
      }
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
        <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#333" }}>Login</h2>
        <form onSubmit={handleLogin}>
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
              outline: "none",
              fontSize: "14px"
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
              outline: "none",
              fontSize: "14px"
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#2575fc",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#6a11cb"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#2575fc"}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
          Don’t have an account?{' '}
          <Link to="/register" style={{ color: "#2575fc", textDecoration: "underline" }}>
            Register here
          </Link>
        </p>

        {message && <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{message}</p>}
      </div>
    </div>
  );
}

export default Login;
