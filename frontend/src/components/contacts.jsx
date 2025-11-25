import React from "react";
import styles from "../styles/contacts.module.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Contacts() {
  return (
    <div className={styles.contacts}>
      {/* Overlay to Improve Text Readability */}
      <div className={styles.overlay}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1>Contact <span className={styles.highlight}>Us</span></h1>
          <p>We’re here to assist you. Feel free to reach out to us!</p>
        </div>

        {/* Contact Details Section */}
        <div className={styles.contactInfo}>
          <div className={styles.contactCard}>
            <FaPhone className={styles.icon} />
            <h3>Phone</h3>
            <p>+1 234 567 890</p>
          </div>

          <div className={styles.contactCard}>
            <FaEnvelope className={styles.icon} />
            <h3>Email</h3>
            <p>support@medifacecare.com</p>
          </div>

          <div className={styles.contactCard}>
            <FaMapMarkerAlt className={styles.icon} />
            <h3>Address</h3>
            <p>123 Skincare Street, Glow City, USA</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className={styles.contactForm}>
          <h2>Send Us a Message</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
