// src/components/admin-login/UserManagement.jsx

import React, { useEffect, useState } from 'react';
// Corrected the import path to be absolute from the src directory
import apiClient from '/src/api/apiClient.js'; 
import AdminLayout from '/src/components/admin-login/AdminLayout.jsx';
import '/src/components/admin-login/UserManagement.css';
import { BsPencil, BsToggleOff, BsToggleOn, BsTrash } from 'react-icons/bs';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        employeeId: '',
        department: '',
        role: 'Faculty',
    });

    const fetchUsers = async () => {
        try {
            // SIMPLIFIED the API call
            const response = await apiClient.get('/auth/users');
            setUsers(response.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const userData = { ...newUser, role: 'Faculty' };
            // SIMPLIFIED
            await apiClient.post('/auth/users', userData);
            alert('Faculty user added successfully!');
            closeAddModal();
            fetchUsers();
        } catch (error) {
            console.error("Failed to add user", error);
            alert(error.response?.data?.message || "Failed to add user.");
        }
    };

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setNewUser({ fullName: '', email: '', employeeId: '', department: '', role: 'Faculty' });
    };

    const handleStatusToggle = async (user) => {
        const newStatus = user.status === 'Active' ? 'Disabled' : 'Active';
        try {
            // SIMPLIFIED
            await apiClient.put(`/auth/users/${user._id}/status`, { status: newStatus });
            fetchUsers();
        } catch (error) {
            alert("Failed to update user status.");
        }
    };
    
    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to permanently delete this user?")) {
            try {
                // SIMPLIFIED
                await apiClient.delete(`/auth/users/${userId}`);
                fetchUsers();
            } catch (error) {
                alert("Failed to delete user.");
            }
        }
    };

    return (
        <AdminLayout>
            <div className="user-management-container">
                <div className="page-header">
                    <h3>User Management</h3>
                    <button className="add-user-btn" onClick={openAddModal}>+ Add New User</button>
                </div>
                <p className="page-description">Manage faculty accounts, roles, and status for the department.</p>

                <div className="user-list-container">
                    <div className="list-header user-list-header">
                        <div>Name</div><div>Email</div><div>Role</div><div>Status</div><div>Actions</div>
                    </div>
                    {loading ? <p>Loading users...</p> : users.map(user => (
                        <div key={user._id} className="list-row user-list-row">
                            <div>{user.fullName}</div><div>{user.email}</div><div>{user.role}</div>
                            <div><span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-disabled'}`}>{user.status}</span></div>
                            <div className="action-buttons-users">
                                <button className="action-btn edit-btn"><BsPencil /> Edit</button>
                                {user.status === 'Active' ? (
                                    <button className="action-btn disable-btn" onClick={() => handleStatusToggle(user)}><BsToggleOff /> Disable</button>
                                ) : (
                                    <button className="action-btn enable-btn" onClick={() => handleStatusToggle(user)}><BsToggleOn /> Enable</button>
                                )}
                                <button className="action-btn delete-btn" onClick={() => handleDelete(user._id)}><BsTrash /> Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isAddModalOpen && (
                <div className="modal-overlay" onClick={closeAddModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>Add New Faculty User</h4>
                            <button className="close-btn" onClick={closeAddModal}>×</button>
                        </div>
                        <form onSubmit={handleAddUser} className="modal-body">
                            <div className="form-group"><label>Full Name</label><input type="text" name="fullName" value={newUser.fullName} onChange={handleInputChange} required /></div>
                            <div className="form-group"><label>Email</label><input type="email" name="email" value={newUser.email} onChange={handleInputChange} required /></div>
                            <div className="form-group"><label>Employee ID</label><input type="text" name="employeeId" value={newUser.employeeId} onChange={handleInputChange} required /></div>
                            <div className="form-group"><label>Department</label><input type="text" name="department" value={newUser.department} onChange={handleInputChange} /></div>
                            <p className="text-muted small">A default password - password123 - will be set. The user will be required to change it upon first login.</p>
                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={closeAddModal}>Cancel</button>
                                <button type="submit" className="submit-btn">Add User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default UserManagement;