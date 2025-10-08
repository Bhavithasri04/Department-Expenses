// src/components/faculty-login/NewExpense.jsx

import React, { useState, useEffect } from 'react';
// 1. IMPORT the new apiClient
import apiClient from '/src/api/apiClient.js';
import { useNavigate } from 'react-router-dom';
import { BsGrid, BsFileEarmarkArrowUp, BsCollection, BsPerson, BsSearch, BsBell, BsBoxArrowRight, BsUpload } from 'react-icons/bs';
import '/src/components/faculty-login/NewExpense.css';
import logo from '/src/assets/Images/slogo.png';

const NewExpense = () => {
    const navigate = useNavigate();
    
    const [proposalTitle, setProposalTitle] = useState('');
    const [associatedProject, setAssociatedProject] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('');
    const [justification, setJustification] = useState('');
    const [items, setItems] = useState([{ item: '', costPerUnit: '', quantity: 1 }]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const total = items.reduce((acc, current) => {
            const cost = parseFloat(current.costPerUnit) || 0;
            const quantity = parseInt(current.quantity, 10) || 0;
            return acc + (cost * quantity);
        }, 0);
        setTotalAmount(total);
    }, [items]);

    const handleItemChange = (index, event) => {
        const newItems = [...items];
        newItems[index][event.target.name] = event.target.value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { item: '', costPerUnit: '', quantity: 1 }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const proposalData = {
                eventName: proposalTitle,
                eventDescription: justification,
                budgetProposalDate: new Date().toISOString(),
                eventDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
                totalBudget: totalAmount,
                breakdown: items.map(i => ({
                    item: i.item,
                    cost: (parseFloat(i.costPerUnit) || 0) * (parseInt(i.quantity, 10) || 0)
                }))
            };
            
            // 2. SIMPLIFY the API call
            await apiClient.post('/events/proposals', proposalData);
            
            alert('Proposal submitted successfully!');
            navigate('/faculty-dashboard');
        } catch (err) {
            console.error('Failed to submit proposal', err);
            alert('Failed to submit proposal. Please check the console for details.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src={logo} alt="Logo" className="sidebar-logo" />
                </div>
                <nav className="sidebar-nav">
                    <a href="/faculty-dashboard" className="nav-item"><BsGrid className="nav-icon" /> Dashboard</a>
                    <a href="/new-expense" className="nav-item active"><BsFileEarmarkArrowUp className="nav-icon" /> Submit Proposal</a>
                    <a href="/submissions" className="nav-item"><BsCollection className="nav-icon" /> My Proposals</a>
                    <a href="/faculty-profile" className="nav-item"><BsPerson className="nav-icon" /> Profile & Settings</a>
                </nav>
            </aside>
            <main className="main-content">
                <header className="main-header">
                    <nav className="header-nav">
                        <a href="/faculty-dashboard" className="header-nav-item">Dashboard</a>
                        <a href="/new-expense" className="header-nav-item active">Submit Proposal</a>
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
                    <div className="proposal-form-container">
                        <h3>Submit New Budget Proposal</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Proposal Title</label>
                                <input type="text" value={proposalTitle} onChange={(e) => setProposalTitle(e.target.value)} placeholder="e.g., Upgrade Research Lab Equipment" required />
                            </div>
                            <div className="form-group">
                                <label>Associated Project (Optional)</label>
                                <input type="text" value={associatedProject} onChange={(e) => setAssociatedProject(e.target.value)} placeholder="e.g., AI Research Initiative Phase 2" />
                            </div>
                            <div className="form-group">
                                <label>Expense Category</label>
                                <input type="text" value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} placeholder="e.g., Lab Equipment" required />
                            </div>
                            <div className="form-group">
                                <label>Detailed Justification</label>
                                <textarea value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Provide a comprehensive justification for this budget request..." required rows="4"></textarea>
                            </div>

                            <h4>Itemized List</h4>
                            <div className="itemized-list">
                                <div className="item-header">
                                    <div>Item</div>
                                    <div>Cost/Unit</div>
                                    <div>Quantity</div>
                                    <div>Subtotal</div>
                                    <div>Action</div>
                                </div>
                                {items.map((item, index) => (
                                    <div key={index} className="item-row">
                                        <input type="text" name="item" value={item.item} onChange={(e) => handleItemChange(index, e)} placeholder="Item Description" required />
                                        <input type="number" name="costPerUnit" value={item.costPerUnit} onChange={(e) => handleItemChange(index, e)} placeholder="0.00" required />
                                        <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} placeholder="1" required />
                                        <div className="subtotal">₹{((parseFloat(item.costPerUnit) || 0) * (parseInt(item.quantity, 10) || 0)).toFixed(2)}</div>
                                        <button type="button" className="remove-btn" onClick={() => removeItem(index)}>Remove</button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" className="add-item-btn" onClick={addItem}>+ Add Item</button>
                            
                            <div className="total-amount">
                                <strong>Total Amount: ₹{totalAmount.toFixed(2)}</strong>
                            </div>

                            <div className="form-group">
                                <label>Attach Quotes/Invoices (Optional)</label>
                                <div className="upload-box">
                                    <BsUpload />
                                    <span>Upload</span>
                                    <input type="file" />
                                </div>
                            </div>
                            
                            <div className="form-actions">
                                <button type="submit" className="submit-btn">Submit Proposal</button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default NewExpense;