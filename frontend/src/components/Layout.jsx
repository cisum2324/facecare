import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import styles from "../styles/layout.module.css"; // Import updated styles
import { Home, MapPin, Search, User } from "lucide-react";

const Layout = () => {
  const location = useLocation(); // Get current route

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <Outlet />

      {/* Persistent Navigation Bar */}
      <nav className={styles.nav}>
        <Link to="/homepanel" className={`${styles.navItem} ${location.pathname === "/homepanel" ? styles.active : ""}`}>
          <Home className={styles.icon} />
          <span>Home</span>
        </Link>
        <Link to="/skin-analysis" className={`${styles.navItem} ${location.pathname === "/skin-analysis" ? styles.active : ""}`}>
          <Search className={styles.icon} />
          <span>Analyze</span>
        </Link>
        <Link to="/map" className={`${styles.navItem} ${location.pathname === "/map" ? styles.active : ""}`}>
          <MapPin className={styles.icon} />
          <span>Map</span>
        </Link>
        <Link to="" className={`${styles.navItem} ${location.pathname === "/account" ? styles.active : ""}`}>
          <User className={styles.icon} />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
