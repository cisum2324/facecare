import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaBirthdayCake, FaVenusMars } from "react-icons/fa";
import styles from "../styles/Register.module.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("age", age);
      formData.append("gender", gender);

      const response = await axios.post("http://localhost:8000/register/", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      alert(response.data.message);
      setShowModal(true); // Show verification modal after successful registration
    } catch (error) {
      alert(error.response?.data?.detail || "Error registering user!");
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerForm}>
        <h2 className={styles.heading}>Register</h2>
        <form onSubmit={handleRegister}>
          {/* Username Field */}
          <div className={styles.inputContainer}>
            <FaUser className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Age Field */}
          <div className={styles.inputContainer}>
            <FaBirthdayCake className={styles.inputIcon} />
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {/* Gender Select Field */}
          <div className={styles.inputContainer}>
            <FaVenusMars className={styles.inputIcon} />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={styles.input}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" className={styles.button}>
            Register
          </button>
        </form>

        <div className={styles.loginLink}>
          <p>
            Already have an account? <Link to="/login">Login now!</Link>
          </p>
        </div>
      </div>

      {/* Modal for Email Verification */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Verify Your Account</h3>
            <p>Please check your email and verify your account.</p>
            <button onClick={() => navigate("/mailtrap")} className={styles.modalButton}>
              Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
