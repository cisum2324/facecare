import React from "react";
import styles from "../styles/homepanel.module.css";
import { Upload, Brain, CheckCircle, LocateFixed } from "lucide-react";

const HomePanel = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src="/assets/logo.png" alt="Skin Care Hub Logo" className={styles.logo} />
      </header>

      <section className={styles.content}>
        <h2 className={styles.title}>✨ Discover Your Skin's Needs ✨</h2>
        <p className={styles.subtitle}>
          Our AI-powered system analyzes your facial skin to detect <strong>tone</strong>, <strong>conditions</strong>,
          and suggest the best <strong>skincare</strong> and <strong>treatments</strong>.  
          Plus, you can find <strong>nearby dermatologists</strong> for professional care.
        </p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <Upload className={styles.iconStep} />
            <p><strong>Upload a Photo:</strong> Take or select an image of your face.</p>
          </div>

          <div className={styles.step}>
            <Brain className={styles.iconStep} />
            <p><strong>AI Skin Analysis:</strong> Detects conditions like acne, dryness, redness.</p>
          </div>

          <div className={styles.step}>
            <CheckCircle className={styles.iconStep} />
            <p><strong>Personalized Skincare:</strong> Get product & treatment recommendations.</p>
          </div>

          <div className={styles.step}>
            <LocateFixed className={styles.iconStep} />
            <p><strong>Find Experts Nearby:</strong> Locate dermatologists & skincare stores.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePanel;
