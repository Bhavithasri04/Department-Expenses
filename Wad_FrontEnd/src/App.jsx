import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '/src/components/home/Home.jsx';
import FacultyLogin from '/src/components/faculty-login/Login.jsx';
import FacultyDashboard from '/src/components/faculty-login/FacultyDashboard.jsx';
import ForceChangePassword from '/src/components/faculty-login/ForceChangePassword.jsx';
import NewExpense from '/src/components/faculty-login/NewExpense.jsx';
import Submissions from '/src/components/faculty-login/Submissions.jsx';
import FacultyProfile from '/src/components/faculty-login/FacultyProfile.jsx';
import AdminDashboard from '/src/components/admin-login/AdminDashboard.jsx';
import AdminApprovals from '/src/components/admin-login/AdminApprovals.jsx';
import BudgetManagement from '/src/components/admin-login/BudgetManagement.jsx';
import UserManagement from '/src/components/admin-login/UserManagement.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<FacultyLogin />} /> {/* This is the ONLY login route */}
        <Route path="/force-change-password" element={<ForceChangePassword />} />

        {/* Faculty Routes */}
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/new-expense" element={<NewExpense />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/faculty-profile" element={<FacultyProfile />} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-approvals" element={<AdminApprovals />} />
        <Route path="/admin-budget" element={<BudgetManagement />} />
        <Route path="/admin-users" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;

