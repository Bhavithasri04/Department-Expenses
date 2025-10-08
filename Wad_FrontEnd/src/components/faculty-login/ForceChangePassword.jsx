// src/components/faculty-login/ForceChangePassword.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. IMPORT the new apiClient
import apiClient from '/src/api/apiClient.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '/src/assets/Images/slogo.png';

const ForceChangePassword = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        setSuccess('');

        try {
            // 2. SIMPLIFY the API call
            await apiClient.put('/auth/profile', { 
                password: newPassword, 
                forcePasswordChange: false 
            });

            setSuccess('Password updated successfully! Redirecting to dashboard...');
            setTimeout(() => {
                navigate('/faculty-dashboard');
            }, 2000);

        } catch (err) {
            setError('Failed to update password. Please try again.');
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <header className="d-flex justify-content-start align-items-center p-1 bg-white shadow-sm">
                <img src={logo} alt="Logo" style={{ width: '200px', marginLeft: '40px'}} />
            </header>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title text-center">Create New Password</h3>
                                <p className="text-center text-muted">For security, you must create a new password before you can proceed.</p>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    {success && <div className="alert alert-success">{success}</div>}
                                    <button type="submit" className="btn btn-primary w-100">Set New Password</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForceChangePassword;