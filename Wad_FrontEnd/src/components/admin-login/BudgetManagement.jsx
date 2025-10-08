// src/components/admin-login/BudgetManagement.jsx

import React, { useEffect, useState } from 'react';
// 1. IMPORT the new apiClient
import apiClient from '/src/api/apiClient.js';
import AdminLayout from '/src/components/admin-login/AdminLayout.jsx';
import '/src/components/admin-login/BudgetManagement.css';

const BudgetManagement = () => {
    const [fiscalYearData, setFiscalYearData] = useState({ year: new Date().getFullYear(), totalBudget: 0 });
    const [categories, setCategories] = useState([]);
    const [facultyBudgets, setFacultyBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 2. SIMPLIFY the API calls
                const [yearRes, categoriesRes, facultyRes] = await Promise.all([
                    apiClient.get('/budget/fiscal-year/current'),
                    apiClient.get('/budget/categories'),
                    apiClient.get('/auth/users')
                ]);

                setFiscalYearData(yearRes.data);
                setCategories(categoriesRes.data);
                setFacultyBudgets(facultyRes.data.filter(user => user.role === 'Faculty'));

            } catch (err) {
                console.error("Failed to fetch budget management data", err);
                alert("Failed to load data. Please ensure the server is running and you are logged in as an admin.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUpdateTotalBudget = async () => {
        try {
            // SIMPLIFIED
            await apiClient.post('/budget/fiscal-year', fiscalYearData);
            alert('Total budget updated successfully!');
        } catch (error) {
            console.error("Failed to update total budget", error);
            alert("Error updating total budget.");
        }
    };
    
    const handleUpdateCategories = async () => {
        try {
            // SIMPLIFIED
            await apiClient.post('/budget/categories/bulk', { categories });
            alert('Categories updated successfully!');
        } catch (error) {
            console.error("Failed to update categories", error);
            alert("Error updating categories.");
        }
    };

    const handleSaveFacultyBudgets = async () => {
         try {
            const budgetData = facultyBudgets.map(f => ({ userId: f._id, assignedBudget: f.assignedBudget }));
            // SIMPLIFIED
            await apiClient.put('/budget/faculty/budgets', { facultyBudgets: budgetData });
            alert('Faculty budgets saved successfully!');
        } catch (error) {
            console.error("Failed to save faculty budgets", error);
            alert("Error saving faculty budgets.");
        }
    };

    const handleCategoryChange = (index, event) => {
        const newCategories = [...categories];
        newCategories[index][event.target.name] = event.target.value;
        setCategories(newCategories);
    };

    const addCategoryRow = () => {
        setCategories([...categories, { name: '', allocatedAmount: 0 }]);
    };
    
    const handleFacultyBudgetChange = (index, event) => {
        const newFacultyBudgets = [...facultyBudgets];
        newFacultyBudgets[index][event.target.name] = event.target.value;
        setFacultyBudgets(newFacultyBudgets);
    };

    if (loading) {
        return <AdminLayout><div>Loading Budget Management...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="budget-management-container">
                <p>Admin tools for setting fiscal year budgets, allocating category funds, and assigning faculty budgets.</p>
                
                <div className="budget-section">
                    <h4>Fiscal Year Budget Overview</h4>
                    <div className="total-budget-form">
                        <label>Current Total Budget for {fiscalYearData.year}:</label>
                        <div className="input-group">
                            <span>₹</span>
                            <input type="number" value={fiscalYearData.totalBudget} onChange={(e) => setFiscalYearData({...fiscalYearData, totalBudget: e.target.value})} />
                        </div>
                        <button className="update-btn" onClick={handleUpdateTotalBudget}>Update Total Budget</button>
                    </div>
                </div>

                <div className="budget-section">
                    <h4>Category Allocations</h4>
                    <div className="list-container">
                        <div className="list-header category-header">
                            <div>Category Name</div>
                            <div>Allocated Amount</div>
                        </div>
                        {categories.map((cat, index) => (
                            <div key={index} className="list-row category-row">
                                <input type="text" name="name" placeholder="Category Name" value={cat.name} onChange={(e) => handleCategoryChange(index, e)} />
                                <div className="input-group">
                                    <span>₹</span>
                                    <input type="number" name="allocatedAmount" value={cat.allocatedAmount} onChange={(e) => handleCategoryChange(index, e)} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="add-btn" onClick={addCategoryRow}>+ Add Category</button>
                    <button className="update-btn float-right" onClick={handleUpdateCategories}>Update Category Allocations</button>
                </div>

                <div className="budget-section">
                    <h4>Faculty Budget Assignments</h4>
                    <input type="text" placeholder="Search faculty..." className="search-faculty" />
                    <div className="list-container">
                         <div className="list-header faculty-header">
                            <div>Faculty Name</div>
                            <div>Department</div>
                            <div>Assigned Budget</div>
                        </div>
                        {facultyBudgets.map((faculty, index) => (
                            <div key={faculty._id} className="list-row faculty-row">
                                <div>{faculty.fullName}</div>
                                <div>{faculty.department || 'N/A'}</div>
                                <div className="input-group">
                                    <span>₹</span>
                                    <input type="number" name="assignedBudget" value={faculty.assignedBudget || 0} onChange={(e) => handleFacultyBudgetChange(index, e)} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="update-btn float-right" onClick={handleSaveFacultyBudgets}>Save Faculty Budgets</button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default BudgetManagement;