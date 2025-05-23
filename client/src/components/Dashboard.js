import React, { useEffect, useState } from "react";
import { checkIfAdmin } from './firebase/firebaseConfig';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const adminStatus = await checkIfAdmin();
      setIsAdmin(adminStatus);
      if (adminStatus) {
        navigate('/admin'); // Redirect to Admin Panel if user is admin
      } else {
        navigate('/user'); // Redirect to User Dashboard if user is not admin
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <div>
      {isAdmin ? <h1>Admin Dashboard</h1> : <h1>User Dashboard</h1>}
    </div>
  );
};

export default Dashboard;
