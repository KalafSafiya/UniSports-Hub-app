import React from "react";
import ProtectedRoute from "./ProtectedRoute";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Guest Pages
import GuestDashboard from "./Pages/GuestDashboard/GuestDashboard";
import GuestContact from "./Pages/GuestContact/GuestContact";
import GuestSchedule from "./Pages/GuestSchedule/GuestSchedule";
import GuestSports from "./Pages/GuestSports/GuestSports";

// Admin Pages
import AdminDashboard from "./AdminPages/AdminDashbBoard/AdminDashBoard";
import AdminManageNews from "./AdminPages/AdminNewsAnnouncements/AdminNewsAnnouncements";
import AdminTeamApprovals from "./AdminPages/AdminCoachRequests/AdminCoachRequests";
import AdminScheduleRequests from "./AdminPages/AdminScheduleRequests/AdminScheduleRequests";
import AdminBookingRequests from "./AdminPages/AdminBookingRequests/AdminBookingRequests";
import AdminContactRequests from "./AdminPages/AdminContact/AdminContact";
import AdminManageCoaches from "./AdminPages/AdminManageCoaches/AdminManageCoaches";

// Coach Pages
import CoachDashBoard from "./CoachPages/CoachDashBoard/CoachDashBoard";
import CoachManageTeams from "./CoachPages/CoachManageTeams/CoachManageTeam";
import CoachManageSchedule from "./CoachPages/CoachManageSchedule/CoachManageSchedule";

// Login
import Login from "./Pages/Login/Login";

function App() {
  return (
    <Router>
      <Routes>
        {/* Guest Routes */}
        <Route path="/" element={<GuestDashboard />} />
        <Route path="/contact" element={<GuestContact />} />
        <Route path="/schedules" element={<GuestSchedule />} />
        <Route path="/sports-and-teams" element={<GuestSports />} />

        <Route path="/login" element={<Login />} />
        {/* Admin Routes */}
        <Route element={<ProtectedRoute role="Admin" />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/news-and-announcements" element={<AdminManageNews />} />
        <Route path="/sports-requests" element={<AdminTeamApprovals />} />
        <Route path="/schedule-requests" element={<AdminScheduleRequests />} />
        <Route path="/booking-requests" element={<AdminBookingRequests />} />
        <Route path="/contact-requests" element={<AdminContactRequests />} />
        <Route path="/manage-coaches" element={<AdminManageCoaches />} />

        </Route>
        {/* Coach Routes */}
        <Route element={<ProtectedRoute role="Coach" />}>
        <Route path="/coach-dashboard" element={<CoachDashBoard />} />
        <Route path="/manage-team" element={<CoachManageTeams />} />
        <Route path="/schedule-session" element={<CoachManageSchedule />} />

        </Route>
        {/* Auth/Login */}


        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
