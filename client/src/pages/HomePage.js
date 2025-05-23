// client/src/pages/HomePage.js

import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-container">
      <h1>Welcome to the University Booking System</h1>
      <p>Your go-to place for booking rooms and equipment for your classes and events.</p>
      <Link to="/signin" className="btn-signin">
        Sign In
      </Link>
    </div>
  );
}
