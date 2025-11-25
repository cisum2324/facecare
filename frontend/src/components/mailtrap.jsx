import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/mailtrap.module.css"; // Import styles
import axios from "axios";
import { CheckCircle, Loader2, Mail } from "lucide-react"; // Import icons

const Mailtrap = () => {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal state

  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!token.trim()) {
      setMessage("Please enter a verification token.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.get(`http://localhost:8000/verify-email/?token=${token}`);
      setMessage(response.data.message);

      if (response.data.message.includes("success")) {
        setShowModal(true); // Show modal on success
      }
    } catch (error) {
      setMessage(error.response?.data?.detail || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: "url('/assets/email-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={styles.card}>
        <Mail className={styles.icon} />
        <h2>Email Verification</h2>
        <p>Enter the verification token sent to your email.</p>

        <input
          type="text"
          placeholder="Enter Verification Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className={styles.input}
        />

        <button onClick={handleVerify} className={styles.button} disabled={loading}>
          {loading ? <Loader2 className={styles.loader} /> : "Verify Email"}
        </button>

        {message && (
          <div className={`${styles.message} ${message.includes("success") ? styles.success : styles.error}`}>
            {message.includes("success") ? <CheckCircle className={styles.successIcon} /> : null}
            {message}
          </div>
        )}
      </div>

      {/* Modal for Successful Verification */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <CheckCircle className={styles.modalIcon} />
            <h3>Email Verified Successfully!</h3>
            <p>You can now log in to your account.</p>
            <button onClick={() => navigate("/login")} className={styles.modalButton}>
              Proceed to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mailtrap;
