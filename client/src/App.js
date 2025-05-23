import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged, getIdTokenResult } from "firebase/auth";

import HomePage from "./pages/HomePage";
import SignUp from "./pages/Signup";
import SignIn from "./pages/SignIn.js";
import CalendarView from "./pages/CalendarView";
import CreateBooking from "./pages/CreateBooking"; // Import CreateBooking
import AdminDashboard from "./admin/AdminDashboard";
import ManageResources from "./admin/ManageResources";

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Current User:", currentUser); // Debugging line
      if (currentUser) {
        setUser(currentUser);
        const tokenResult = await getIdTokenResult(currentUser, true);
        setIsAdmin(tokenResult.claims.admin === true);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {user && isAdmin && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/resources" element={<ManageResources user={user} />} />
          </>
        )}

        {user && !isAdmin && (
          <>
            <Route path="/calendar" element={<CalendarView user={user} />} />
            <Route path="/calendar/create" element={<CreateBooking user={user} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;