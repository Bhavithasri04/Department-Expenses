// src/components/faculty-login/Submissions.jsx

import React, { useEffect, useState } from 'react';
// 1. IMPORT the new apiClient
import apiClient from '/src/api/apiClient.js';
import { useNavigate } from 'react-router-dom';
import { BsGrid, BsFileEarmarkArrowUp, BsCollection, BsPerson, BsSearch, BsBell, BsBoxArrowRight } from 'react-icons/bs';
import '/src/components/faculty-login/Submissions.css';
import logo from '/src/assets/Images/slogo.png';

const Submissions = () => {
    const navigate = useNavigate();

    const [allProposals, setAllProposals] = useState([]);
    const [filteredProposals, setFilteredProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                // 2. SIMPLIFY the API call
                const response = await apiClient.get('/events/proposals');
                setAllProposals(response.data);
                setFilteredProposals(response.data); 
            } catch (err) {
                console.error('Failed to fetch budgets.', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBudgets();
    }, []);

    useEffect(() => {
        let result = allProposals;

        if (statusFilter !== 'All') {
            result = result.filter(p => p.status === statusFilter);
        }

        if (searchQuery) {
            result = result.filter(p =>
                p.eventName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProposals(result);
    }, [statusFilter, searchQuery, allProposals]);

    const handleRowClick = (proposal) => {
        setSelectedProposal(proposal);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProposal(null);
    };

    const getStatusClass = (status) => {
        if (status === 'Accepted') return 'status-approved';
        if (status === 'Rejected') return 'status-rejected';
        return 'status-pending';
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
                    <a href="/submissions" className="nav-item active"><BsCollection className="nav-icon" /> My Proposals</a>
                    <a href="/faculty-profile" className="nav-item"><BsPerson className="nav-icon" /> Profile & Settings</a>
                </nav>
            </aside>
            <main className="main-content">
                <header className="main-header">
                    <nav className="header-nav">
                        <a href="/faculty-dashboard" className="header-nav-item">Dashboard</a>
                        <a href="/new-expense" className="header-nav-item">Submit Proposal</a>
                        <a href="/submissions" className="header-nav-item active">My Proposals</a>
                        <a href="/faculty-profile" className="header-nav-item">Profile</a>
                    </nav>
                    <div className="header-actions">
                        <BsSearch className="action-icon" />
                        <BsBell className="action-icon" />
                        <button className="logout-btn" onClick={handleLogout}><BsBoxArrowRight /> Logout</button>
                    </div>
                </header>
                <section className="content-body">
                    <div className="proposals-container">
                        <h3>My Proposals</h3>
                        <div className="filter-bar">
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="All">Status: All</option>
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            <input type="date" />
                            <div className="search-bar">
                                <BsSearch />
                                <input type="text" placeholder="Search by title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                        </div>

                        <div className="proposals-table">
                            <div className="table-header">
                                <div>Title</div>
                                <div>Submission Date</div>
                                <div>Total Amount</div>
                                <div>Status</div>
                            </div>
                            {filteredProposals.map(proposal => (
                                <div key={proposal._id} className="table-row" onClick={() => handleRowClick(proposal)}>
                                    <div>{proposal.eventName}</div>
                                    <div>{new Date(proposal.budgetProposalDate).toLocaleDateString()}</div>
                                    <div>₹{proposal.totalBudget.toLocaleString('en-IN')}</div>
                                    <div><span className={`status-badge ${getStatusClass(proposal.status)}`}>{proposal.status}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {isModalOpen && selectedProposal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h4>{selectedProposal.eventName}</h4>
                                <p>Submitted on {new Date(selectedProposal.budgetProposalDate).toLocaleString()} • Category: Lab Equipment</p>
                            </div>
                            <button className="close-btn" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="summary-section">
                                <div>
                                    <label>Proposal ID</label>
                                    <p>{selectedProposal._id.slice(-6).toUpperCase()}</p>
                                </div>
                                <div>
                                    <label>Total Amount</label>
                                    <p>₹{selectedProposal.totalBudget.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <label>Status</label>
                                    <p><span className={`status-badge ${getStatusClass(selectedProposal.status)}`}>{selectedProposal.status}</span></p>
                                </div>
                                <div>
                                    <label>Associated Project</label>
                                    <p>N/A (if applicable)</p>
                                </div>
                            </div>

                            <h5>Detailed Justification</h5>
                            <p className="justification-text">{selectedProposal.eventDescription}</p>

                            <h5>Itemized List ({selectedProposal.breakdown.length} Items)</h5>
                            <div className="itemized-table">
                                <div className="itemized-header">
                                    <div>Item</div>
                                    <div>Quantity</div>
                                    <div>Cost per Item</div>
                                    <div>Total</div>
                                </div>
                                {selectedProposal.breakdown.map((item, index) => (
                                    <div key={index} className="itemized-row">
                                        <div>{item.item}</div>
                                        <div>1</div>
                                        <div>₹{item.cost.toLocaleString('en-IN')}</div>
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
        </div>
    );
};

export default Submissions;