// src/components/faculty-login/FacultyDashboard.jsx

import React, { useEffect, useState } from 'react';
// 1. IMPORT the new apiClient
import apiClient from '/src/api/apiClient.js';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { BsGrid, BsFileEarmarkArrowUp, BsCollection, BsPerson, BsSearch, BsBell, BsBoxArrowRight } from 'react-icons/bs';
import '/src/components/faculty-login/FacultyDashboard.css';
import logo from '/src/assets/Images/slogo.png';

const FacultyDashboard = () => {
    const [proposals, setProposals] = useState([]);
    const [stats, setStats] = useState({
        totalSpent: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    });
    const [userName, setUserName] = useState(''); 
    const [allocatedBudget, setAllocatedBudget] = useState(0); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // It's still good practice to check for the token's existence before trying to fetch
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                
                // 2. SIMPLIFY the API calls - no more manual headers!
                const [profileRes, proposalsRes] = await Promise.all([
                    apiClient.get('/auth/profile'),
                    apiClient.get('/events/proposals')
                ]);
                
                setUserName(profileRes.data.fullName);
                setAllocatedBudget(profileRes.data.assignedBudget || 0);

                const userProposals = proposalsRes.data;
                setProposals(userProposals.slice(0, 5));

                // Calculate stats
                let totalSpent = 0, pending = 0, approved = 0, rejected = 0;
                userProposals.forEach(p => {
                    if (p.status === 'Accepted') { totalSpent += p.totalBudget; approved++; } 
                    else if (p.status === 'Pending') { pending++; } 
                    else if (p.status === 'Rejected') { rejected++; }
                });
                setStats({ totalSpent, pending, approved, rejected });

            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                 // If the error is 403 (invalid token), redirect to login
                if (err.response && err.response.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    
    const chartData = [
        { name: 'Approved', value: stats.approved },
        { name: 'Pending', value: stats.pending },
        { name: 'Rejected', value: stats.rejected },
    ];

    const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

    if (loading) {
        return <div>Loading Dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src={logo} alt="Logo" className="sidebar-logo" />
                </div>
                <nav className="sidebar-nav">
                    <a href="/faculty-dashboard" className="nav-item active"><BsGrid className="nav-icon" /> Dashboard</a>
                    <a href="/new-expense" className="nav-item"><BsFileEarmarkArrowUp className="nav-icon" /> Submit Proposal</a>
                    <a href="/submissions" className="nav-item"><BsCollection className="nav-icon" /> My Proposals</a>
                    <a href="/faculty-profile" className="nav-item"><BsPerson className="nav-icon" /> Profile & Settings</a>
                </nav>
            </aside>
            <main className="main-content">
                <header className="main-header">
                    <nav className="header-nav">
                        <a href="/faculty-dashboard" className="header-nav-item active">Dashboard</a>
                        <a href="/new-expense" className="header-nav-item">Submit Proposal</a>
                        <a href="/submissions" className="header-nav-item">My Proposals</a>
                        <a href="/faculty-profile" className="header-nav-item">Profile</a>
                    </nav>
                    <div className="header-actions">
                        <BsSearch className="action-icon" />
                        <BsBell className="action-icon" />
                        <button className="logout-btn" onClick={handleLogout}><BsBoxArrowRight /> Logout</button>
                    </div>
                </header>
                <section className="content-body">
                    <div className="welcome-header">
                        <h2>Welcome, {userName}!</h2>
                        <p>Here’s a quick overview of your budget and proposals.</p>
                    </div>

                    <div className="stats-cards">
                        <div className="stat-card">
                            <h4>Personal Allocated Budget</h4>
                            <p>₹{allocatedBudget.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="stat-card">
                            <h4>Total Spent</h4>
                            <p>₹{stats.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="stat-card">
                            <h4>Remaining Balance</h4>
                            <p>₹{(allocatedBudget - stats.totalSpent).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>

                    <div className="visuals-section">
                        <div className="chart-container">
                            <h4>Proposal Status</h4>
                             <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" labelLine={false}>
                                        {chartData.map((entry, index) => ( <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="activity-container">
                            <h4>Recent Activity</h4>
                            <ul className="activity-list">
                                {proposals.length > 0 ? proposals.map(p => (
                                    <li key={p._id}>
                                        <span>Proposal '{p.eventName}' submitted</span>
                                        <span className="activity-date">{new Date(p.budgetProposalDate).toLocaleDateString()}</span>
                                    </li>
                                )) : (
                                    <p>No recent activity.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default FacultyDashboard;