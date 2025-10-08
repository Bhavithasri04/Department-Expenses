// src/components/admin-login/AdminDashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminLayout from './AdminLayout';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBudget: 0,
        totalSpent: 0,
        pendingProposals: 0,
    });
    const [categories, setCategories] = useState([]);
    // --- NEW STATE FOR OUR DYNAMIC CHART ---
    const [lineChartData, setLineChartData] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

                const [yearRes, categoriesRes, allProposalsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/budget/fiscal-year/current', authHeaders),
                    axios.get('http://localhost:5000/api/budget/categories', authHeaders),
                    axios.get('http://localhost:5000/api/events/proposals/all', authHeaders)
                ]);

                const allProposals = allProposalsRes.data;

                // --- CALCULATE STATS (This part is already correct) ---
                const totalSpent = allProposals.filter(p => p.status === 'Accepted').reduce((acc, p) => acc + p.totalBudget, 0);
                const pendingCount = allProposals.filter(p => p.status === 'Pending').length;

                setStats({
                    totalBudget: yearRes.data.totalBudget,
                    totalSpent: totalSpent,
                    pendingProposals: pendingCount,
                });
                setCategories(categoriesRes.data);

                // --- NEW LOGIC TO PROCESS DATA FOR THE LINE CHART ---
                const monthlySpending = {};
                allProposals.forEach(p => {
                    if (p.status === 'Accepted') {
                        const month = new Date(p.eventDate).toLocaleString('default', { month: 'short' });
                        if (!monthlySpending[month]) {
                            monthlySpending[month] = 0;
                        }
                        monthlySpending[month] += p.totalBudget;
                    }
                });

                const formattedChartData = Object.keys(monthlySpending).map(month => ({
                    name: month,
                    Actual: monthlySpending[month],
                    // "Planned" is harder to calculate, so we'll use a placeholder for now
                    Planned: (monthlySpending[month] * 1.1).toFixed(0) 
                }));
                
                setLineChartData(formattedChartData);

            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    if (loading) {
        return <AdminLayout><div>Loading Dashboard...</div></AdminLayout>
    }

    return (
        <AdminLayout>
            <h4>Overview</h4>
            <div className="overview-cards">
                {/* ... Card JSX remains the same ... */}
                 <div className="card large">
                    <label>Total Department Budget</label>
                    <span>₹{stats.totalBudget.toLocaleString('en-IN')}</span>
                    <small>For {new Date().getFullYear()}</small>
                </div>
                <div className="card">
                    <label>Total Spent</label>
                    <span>₹{stats.totalSpent.toLocaleString('en-IN')}</span>
                </div>
                <div className="card">
                    <label>Remaining Department Budget</label>
                    <span>₹{(stats.totalBudget - stats.totalSpent).toLocaleString('en-IN')}</span>
                </div>
                <div className="card action">
                    <label>Action Items</label>
                    <span>{stats.pendingProposals} New Proposals</span>
                    <small>Awaiting your review</small>
                </div>
            </div>

            <h4>Budget Analysis</h4>
            <div className="analysis-charts">
                <div className="chart-card">
                    <h5>Budget Burn Rate</h5>
                    <ResponsiveContainer width="100%" height={300}>
                        {/* --- THIS NOW USES THE DYNAMIC lineChartData STATE --- */}
                        <LineChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
                            <Line type="monotone" dataKey="Planned" stroke="#8884d8" />
                            <Line type="monotone" dataKey="Actual" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-card">
                    <h5>Budget Allocation by Category</h5>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={categories} cx="50%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="allocatedAmount" nameKey="name">
                                {categories.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}
                            </Pie>
                            <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;