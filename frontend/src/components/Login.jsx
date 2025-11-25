import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Import Icons
import styles from '../styles/Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);

      const response = await axios.post('http://localhost:8000/login/', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      if (response.data.message === "Login successful") {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('lastLoggedInUser', email);

        alert('Login successful!');
        navigate('/homepanel');
      }
    } catch (error) {
      alert(error.response?.data?.detail || 'Invalid credentials!');
      console.error(error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2 className={styles.heading}>Login</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.inputContainer}>
            <FaEnvelope className={styles.inputIcon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputContainer}>
            <FaLock className={styles.inputIcon} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.button}>Login</button>
        </form>
        <div className={styles.registerLink}>
          <p>No account yet? <Link to="/register">Register now!</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
