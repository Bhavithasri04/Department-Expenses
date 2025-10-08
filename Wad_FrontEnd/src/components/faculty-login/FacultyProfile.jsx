// src/components/faculty-login/FacultyProfile.jsx

import React, { useEffect, useState } from 'react';
// 1. IMPORT the new apiClient
import apiClient from '/src/api/apiClient.js';
import { useNavigate } from 'react-router-dom';
import { BsGrid, BsFileEarmarkArrowUp, BsCollection, BsPerson, BsSearch, BsBell, BsBoxArrowRight } from 'react-icons/bs';
import '/src/components/faculty-login/FacultyProfile.css';
import logo from '/src/assets/Images/slogo.png';

const FacultyProfile = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({});
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('view');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // 2. SIMPLIFY the API call
                const response = await apiClient.get('/auth/profile');
                
                setUserData(response.data);
                setFormData(response.data);
            } catch (err) {
                console.error("Failed to fetch user profile", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // SIMPLIFIED
            const response = await apiClient.put('/auth/profile', formData);
            setUserData(response.data);
            setActiveTab('view');
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Failed to update profile', err);
            alert('Failed to update profile.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src={logo} alt="Logo" className="sidebar-logo" />
                </div>
                <nav className="sidebar-nav">
                    <a href="/faculty-dashboard" className="nav-item"><BsGrid className="nav-icon" /> Dashboard</a>
                    <a href="/new-expense" className="nav-item"><BsFileEarmarkArrowUp className="nav-icon" /> Submit Proposal</a>
                    <a href="/submissions" className="nav-item"><BsCollection className="nav-icon" /> My Proposals</a>
                    <a href="/faculty-profile" className="nav-item active"><BsPerson className="nav-icon" /> Profile & Settings</a>
                </nav>
            </aside>
            <main className="main-content">
                <header className="main-header">
                     <nav className="header-nav">
                        <a href="/faculty-dashboard" className="header-nav-item">Dashboard</a>
                        <a href="/new-expense" className="header-nav-item">Submit Proposal</a>
                        <a href="/submissions" className="header-nav-item">My Proposals</a>
                        <a href="/faculty-profile" className="header-nav-item active">Profile</a>
                    </nav>
                    <div className="header-actions">
                        <BsSearch className="action-icon" />
                        <BsBell className="action-icon" />
                        <button className="logout-btn" onClick={handleLogout}><BsBoxArrowRight /> Logout</button>
                    </div>
                </header>
                <section className="content-body">
                    <div className="profile-container">
                        <h3>Profile & Settings</h3>
                        <div className="profile-tabs">
                            <button className={activeTab === 'view' ? 'active' : ''} onClick={() => setActiveTab('view')}>View Profile</button>
                            <button className={activeTab === 'edit' ? 'active' : ''} onClick={() => setActiveTab('edit')}>Edit Profile</button>
                        </div>
                        
                        {activeTab === 'view' ? (
                            <div className="profile-details-view">
                                <h4>Faculty Profile Details</h4>
                                <div className="details-grid">
                                    <div><label>Full Name</label><p>{userData.fullName || 'N/A'}</p></div>
                                    <div><label>Employee ID</label><p>{userData.employeeId || 'N/A'}</p></div>
                                    <div><label>Contact Email</label><p>{userData.email || 'N/A'}</p></div>
                                    <div><label>Phone Number</label><p>{userData.phoneNumber || 'N/A'}</p></div>
                                    <div><label>Office Location</label><p>{userData.officeLocation || 'N/A'}</p></div>
                                    <div><label>Department</label><p>{userData.department || 'N/A'}</p></div>
                                </div>
                            </div>
                        ) : (
                            <div className="profile-details-edit">
                                <h4>Edit Faculty Profile Details</h4>
                                <form onSubmit={handleSubmit}>
                                    <div className="details-grid">
                                        <div><label>Full Name</label><input type="text" name="fullName" value={formData.fullName || ''} onChange={handleInputChange} /></div>
                                        <div><label>Employee ID</label><input type="text" name="employeeId" value={formData.employeeId || ''} onChange={handleInputChange} /></div>
                                        <div><label>Contact Email</label><input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} /></div>
                                        <div><label>Phone Number</label><input type="text" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleInputChange} /></div>
                                        <div><label>Office Location</label><input type="text" name="officeLocation" value={formData.officeLocation || ''} onChange={handleInputChange} /></div>
                                        <div><label>Department</label><input type="text" name="department" value={formData.department || ''} onChange={handleInputChange} /></div>
                                    </div>
                                    <button type="submit" className="save-btn">Save Changes</button>
                                </form>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default FacultyProfile;