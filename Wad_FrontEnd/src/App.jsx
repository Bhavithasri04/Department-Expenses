import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import RoleSelection from './components/role-selection/RoleSelection'; 
import AdminLogin from './components/admin-login/AdminLogin';
import FacultyLogin from './components/faculty-login/FacultyLogin';
import FacultySignUp from './components/faculty-login/FacultySignUp';
import FacultyProfile from './components/faculty-login/FacultyProfile';
import NewExpense from './components/faculty-login/NewExpense';
import Submissions from './components/faculty-login/Submissions';
import AdminProfile from './components/admin-login/AdminProfile';
import AdminApproved from './components/admin-login/AdminApproved';
import AdminRejected from './components/admin-login/AdminRejected';
import Report from './components/admin-login/Report';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/faculty-signup" element={<FacultySignUp />} />
        <Route path="/faculty-login" element={<FacultyLogin />} />
        <Route path="/faculty-profile" element={<FacultyProfile />} />
        <Route path="/new-expense" element={<NewExpense />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/admin-approved" element={<AdminApproved />} />
        <Route path="/report" element={<Report />} />
        <Route path="/adminrejected" element={<AdminRejected />} />

      </Routes>
    </Router>
  );
}

export default App;
