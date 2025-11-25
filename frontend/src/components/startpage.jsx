import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/startpage.css"; // Updated styles

function StartPage() {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/login");
  };

  return (
    <div className="startpage">
      {/* Navigation Bar */}
      <nav className="navbar">
        <img src="/assets/logo.png" alt="GET-GLOW Logo" className="logo" />
        <ul className="nav-links">
          <li onClick={() => navigate("/")}>HOME</li>
          <li onClick={() => navigate("/about-us")}>ABOUT US</li>
          <li onClick={() => navigate("/contacts")}>CONTACT</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-text">
          <h1>Make Your Skin Pop with <span className="highlight">MEDIFACECARE</span></h1>
          <p>Snap, Analyze, Glow! Upload or take a photo, and our AI will assess your skin tone and condition, providing personalized skincare tips just for you!</p>
          <button onClick={handleShopNow} className="shop-now-button">Get Started</button>
        </div>

        {/* Hero Images Section */}
        <div className="hero-images">
          <img src="/assets/skin-care-products (1).png" alt="Skincare Products 1" />
          <img src="/assets/skin-care-products (3).png" alt="Skincare Products 2" />
          <img src="/assets/skin-care-products (2).png" alt="Skincare Products 3" />
        </div>
      </div>
    </div>
  );
}

export default StartPage;
