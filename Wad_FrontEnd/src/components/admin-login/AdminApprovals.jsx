// src/components/admin-login/AdminApprovals.jsx

import React, { useEffect, useState } from 'react';
// 1. IMPORT the new apiClient
import apiClient from '/src/api/apiClient.js';
import AdminLayout from '/src/components/admin-login/AdminLayout.jsx';
import '/src/components/admin-login/AdminApprovals.css';

const AdminApprovals = () => {
    const [activeTab, setActiveTab] = useState('Pending');
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);

    useEffect(() => {
        fetchProposals(activeTab);
    }, [activeTab]);

    const fetchProposals = async (status) => {
        setLoading(true);
        try {
            // 2. SIMPLIFY the API calls
            let url = '/events/proposals/all'; 
            if (status === 'Approved') url = '/events/proposals/approved';
            else if (status === 'Rejected') url = '/events/proposals/rejected';
            
            const response = await apiClient.get(url);

            if (status === 'Pending') {
                setProposals(response.data.filter(p => p.status === 'Pending'));
            }
            else {
                setProposals(response.data);
            }
        } catch (err) {
            console.error(`Failed to fetch ${status} proposals`, err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            // SIMPLIFIED
            await apiClient.put(`/events/proposals/${id}/${action}`);
            fetchProposals(activeTab); 
        } catch (err) {
            console.error(`Failed to ${action} proposal`, err);
        }
    };
    
    const handleReview = (proposal) => {
        setSelectedProposal(proposal);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const getStatusClass = (status) => {
        if (status === 'Accepted') return 'status-approved';
        if (status === 'Rejected') return 'status-rejected';
        return 'status-pending';
    };

    return (
        <AdminLayout>
            <div className="approvals-container">
                <h3>Proposal Approvals</h3>
                <div className="approval-tabs">
                    <button className={activeTab === 'Pending' ? 'active' : ''} onClick={() => setActiveTab('Pending')}>Pending</button>
                    <button className={activeTab === 'Approved' ? 'active' : ''} onClick={() => setActiveTab('Approved')}>Approved</button>
                    <button className={activeTab === 'Rejected' ? 'active' : ''} onClick={() => setActiveTab('Rejected')}>Rejected</button>
                </div>
                <div className="proposals-list">
                    <h4>{activeTab} Proposals</h4>
                    <div className="list-header">
                        <div>Faculty Member</div><div>Proposal Title</div><div>Amount</div><div>Submission Date</div><div>Actions</div>
                    </div>
                    {loading ? <p>Loading...</p> : proposals.map(p => (
                        <div key={p._id} className="list-row">
                            <div>{p.userId?.fullName || 'N/A'}</div><div>{p.eventName}</div><div>₹{p.totalBudget.toLocaleString('en-IN')}</div>
                            <div>{new Date(p.budgetProposalDate).toLocaleDateString()}</div>
                            <div className="action-buttons">
                                {activeTab === 'Pending' && (
                                    <>
                                        <button className="action-approve" onClick={() => handleAction(p._id, 'accepted')}>Approve</button>
                                        <button className="action-reject" onClick={() => handleAction(p._id, 'rejected')}>Reject</button>
                                    </>
                                )}
                                <button className="action-review" onClick={() => handleReview(p)}>Review</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {isModalOpen && selectedProposal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h4>{selectedProposal.eventName}</h4>
                                <p>Submitted by: <strong>{selectedProposal.userId?.fullName || 'N/A'}</strong></p>
                            </div>
                            <button className="close-btn" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="summary-section">
                                <div><label>Proposal ID</label><p>{selectedProposal._id.slice(-6).toUpperCase()}</p></div>
                                <div><label>Total Amount</label><p>₹{selectedProposal.totalBudget.toLocaleString('en-IN')}</p></div>
                                <div><label>Status</label><p><span className={`status-badge ${getStatusClass(selectedProposal.status)}`}>{selectedProposal.status}</span></p></div>
                                <div><label>Submission Date</label><p>{new Date(selectedProposal.budgetProposalDate).toLocaleDateString()}</p></div>
                            </div>
                            <h5>Detailed Justification</h5>
                            <p className="justification-text">{selectedProposal.eventDescription}</p>
                            <h5>Itemized List ({selectedProposal.breakdown.length} Items)</h5>
                            <div className="itemized-table">
                                <div className="itemized-header"><div>Item</div><div>Total Cost</div></div>
                                {selectedProposal.breakdown.map((item, index) => (
                                    <div key={index} className="itemized-row review-item">
                                        <div>{item.item}</div>
                                        <div>₹{item.cost.toLocaleString('en-IN')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="close-modal-btn" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminApprovals;