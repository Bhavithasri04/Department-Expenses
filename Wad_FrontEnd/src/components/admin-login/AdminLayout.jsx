// src/components/admin-login/AdminLayout.jsx

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BsBell, BsBoxArrowRight, BsGridFill, BsClipboardCheck, BsGraphUp, BsPeopleFill } from 'react-icons/bs';
import './AdminLayout.css'; // We will create this CSS file next
import logo from '../../assets/Images/slogo.png';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
    // Clear all session-related data from storage
    localStorage.removeItem('token');
    // You can also use localStorage.clear(); if the token is the only thing stored
    navigate('/');
};
    
    // Function to check if a link is active
    const isActive = (path) => location.pathname === path;

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <div className="header-logo">
                    <img src={logo} alt="Logo" />
                </div>
                <div className="header-actions">
                    <BsBell className="header-icon" />
                    <button className="logout-btn-admin" onClick={handleLogout}><BsBoxArrowRight /> Logout</button>
                </div>
            </header>
            <div className="admin-body">
                <aside className="admin-sidebar">
                    <nav>
                        <Link to="/admin-dashboard" className={`sidebar-link ${isActive('/admin-dashboard') ? 'active' : ''}`}>
                            <BsGridFill className="sidebar-icon" />Admin Dashboard
                        </Link>
                        <Link to="/admin-approvals" className={`sidebar-link ${isActive('/admin-approvals') ? 'active' : ''}`}>
                            <BsClipboardCheck className="sidebar-icon" />Approvals
                        </Link>
                        <Link to="/admin-budget" className={`sidebar-link ${isActive('/admin-budget') ? 'active' : ''}`}>
                            <BsGraphUp className="sidebar-icon" />Budget Management
                        </Link>
                        <Link to="/admin-users" className={`sidebar-link ${isActive('/admin-users') ? 'active' : ''}`}>
                            <BsPeopleFill className="sidebar-icon" />User Management
                        </Link>
                    </nav>
                </aside>
                <main className="admin-main-content">
                    {children} {/* This is where the page-specific content will go */}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;