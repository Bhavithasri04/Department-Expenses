// Wad_BackEnd/routes/budget.js

import express from 'express';
import mongoose from 'mongoose';
import authenticateJWT from '../middleware/auth.js';
import FiscalYear from '../models/FiscalYear.js';
import BudgetCategory from '../models/BudgetCategory.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

// --- FISCAL YEAR ROUTES ---

// GET the current fiscal year's budget
router.get('/fiscal-year/current', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        let fiscalYear = await FiscalYear.findOne({ year: currentYear });
        if (!fiscalYear) {
            // If no budget is set for the current year, return a default
            return res.status(200).json({ year: currentYear, totalBudget: 0, _id: null });
        }
        res.status(200).json(fiscalYear);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fiscal year budget', error });
    }
});

// POST or UPDATE the total budget for a fiscal year
router.post('/fiscal-year', authenticateJWT, isAdmin, async (req, res) => {
    const { year, totalBudget } = req.body;
    try {
        let fiscalYear = await FiscalYear.findOneAndUpdate(
            { year: year },
            { totalBudget: totalBudget, startDate: new Date(`${year}-01-01`), endDate: new Date(`${year}-12-31`) },
            { new: true, upsert: true } // Upsert: create if it doesn't exist
        );
        res.status(201).json(fiscalYear);
    } catch (error) {
        res.status(500).json({ message: 'Error setting fiscal year budget', error });
    }
});


// --- CATEGORY ROUTES ---

// GET all budget categories for the current fiscal year
router.get('/categories', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const currentYearDoc = await FiscalYear.findOne({ year: new Date().getFullYear() });
        if (!currentYearDoc) {
            return res.status(200).json([]); // No year set, so no categories
        }
        const categories = await BudgetCategory.find({ fiscalYear: currentYearDoc._id });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
});

// POST - A bulk endpoint to update/create multiple categories at once
router.post('/categories/bulk', authenticateJWT, isAdmin, async (req, res) => {
    const { categories } = req.body; // Expecting an array of category objects
    try {
        const currentYearDoc = await FiscalYear.findOne({ year: new Date().getFullYear() });
        if (!currentYearDoc) {
            return res.status(400).json({ message: 'Fiscal year not set. Please set the total budget first.' });
        }

        // Use Promise.all to handle multiple async operations
        const promises = categories.map(cat => {
            return BudgetCategory.findOneAndUpdate(
                { _id: cat._id || new mongoose.Types.ObjectId(), fiscalYear: currentYearDoc._id },
                { ...cat, fiscalYear: currentYearDoc._id },
                { new: true, upsert: true }
            );
        });

        const updatedCategories = await Promise.all(promises);
        res.status(201).json(updatedCategories);
    } catch (error) {
        res.status(500).json({ message: 'Error updating categories', error });
    }
});


// --- FACULTY BUDGET ROUTES ---

// PUT - A bulk endpoint to update multiple faculty budgets at once
router.put('/faculty/budgets', authenticateJWT, isAdmin, async (req, res) => {
    const { facultyBudgets } = req.body; // Expecting an array of objects like [{ userId: '...', assignedBudget: 5000 }]
    try {
        const promises = facultyBudgets.map(fb => {
            return User.findByIdAndUpdate(
                fb.userId,
                { assignedBudget: fb.assignedBudget },
                { new: true }
            );
        });
        await Promise.all(promises);
        res.status(200).json({ message: 'Faculty budgets updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating faculty budgets', error });
    }
});


export default router;