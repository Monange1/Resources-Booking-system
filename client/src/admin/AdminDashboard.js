import React from "react";
import { Link } from "react-router-dom";
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Admin Panel</h1>
      <div className="admin-links">
        <Link to="/admin/resources" className="admin-link">
          Manage Resources
        </Link>
        {/* Add more links like "Manage Bookings" if implemented */}
      </div>
    </div>
  );
}

export default AdminDashboard;