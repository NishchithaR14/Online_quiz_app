import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // 👈 Import Link for navigation

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5000/login', { email, password });
      setMessage(res.data.message + " (" + res.data.role + ")");
    } catch (err) {
      setMessage("❌ Invalid credentials");
    }
  };

  return (
    <div style={{ width: "400px", margin: "100px auto", textAlign: "center" }}>
      <h2>Login (User/Admin)</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit" style={{ padding: "8px 16px", marginTop: "10px" }}>
          Login
        </button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Don’t have an account?{' '}
        <Link to="/register" style={{ color: "blue", textDecoration: "underline" }}>
          Register here
        </Link>
      </p>

      <p>{message}</p>
    </div>
  );
}

export default Login;
