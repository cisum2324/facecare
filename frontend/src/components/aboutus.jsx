import React from "react";
import styles from "../styles/aboutus.module.css";

function AboutUs() {
  return (
    <div className={styles.aboutUs}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1>About <span className={styles.highlight}>MediFaceCare</span></h1>
        <p>Your Personalized AI-Powered Skincare Assistant</p>
      </div>

      {/* System Overview Section */}
      <div className={styles.section}>
        <h2>How It Works</h2>
        <p>
          MediFaceCare is an innovative AI-driven skincare system that helps you understand your skin better. 
          Simply upload or take a photo of your face, and our AI will analyze your skin tone and condition. 
          You'll receive personalized skincare recommendations, including tips, routines, and possible treatments.
        </p>
      </div>

      {/* Features Section */}
      <div className={styles.features}>
        <h2>Key Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <h3>🖼️ Upload or Take a Photo</h3>
            <p>Capture an image or upload an existing one for instant skin analysis.</p>
          </div>
          <div className={styles.feature}>
            <h3>📊 AI Skin Analysis</h3>
            <p>Detects skin tone, texture, acne, dark spots, and other conditions.</p>
          </div>
          <div className={styles.feature}>
            <h3>💡 Personalized Skincare Tips</h3>
            <p>Get customized skincare routines based on your unique skin condition.</p>
          </div>
          <div className={styles.feature}>
            <h3>📍 Find Nearby Experts</h3>
            <p>Locate the nearest dermatologists and skincare shops in your area.</p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className={styles.section}>
        <h2>Our Mission</h2>
        <p>
          At MediFaceCare, our goal is to empower individuals with AI-powered skincare insights. 
          We believe in making advanced skincare accessible, ensuring that everyone can take better care of their skin with the right knowledge and expert support.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
