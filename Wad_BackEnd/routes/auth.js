// Wad_BackEnd/routes/auth.js

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authenticateJWT from '../middleware/auth.js';

const router = express.Router();

// --- PUBLIC LOGIN ROUTE (NO MIDDLEWARE) ---
router.post('/login', async (req, res) => {
    const { employeeId, password } = req.body;
    try {
        const user = await User.findOne({ employeeId });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.status === 'Disabled') {
            return res.status(403).json({ message: 'Your account has been disabled.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, role: user.role, forcePasswordChange: user.forcePasswordChange });
    } catch (error) {
        res.status(500).json({ message: 'Error during login' });
    }
});

// --- PROTECTED PROFILE ROUTE (USES MIDDLEWARE) ---
router.get('/profile', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});
// PUT - Update the current user's own profile (e.g., for password change)
router.put('/profile', authenticateJWT, async (req, res) => {
    // The user's ID comes from the JWT token after passing through the middleware
    const userId = req.user.id;
    const { password, forcePasswordChange } = req.body;

    // We must have a new password to proceed
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password before saving it
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Update the forcePasswordChange flag
        user.forcePasswordChange = forcePasswordChange;

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});
// --- PROTECTED USER MANAGEMENT ROUTES ---

// GET all users
router.get('/users', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access denied' });
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// POST - Create a new user
router.post('/users', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access denied' });
    const { fullName, email, employeeId, department, role } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { employeeId }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or Employee ID already exists' });
        }
        
        // --- THIS IS WHERE THE DEFAULT PASSWORD IS SET ---
        const defaultPassword = "password123";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const newUser = new User({
            fullName, email, employeeId, department, role,
            password: hashedPassword,
            forcePasswordChange: true,
            phoneNumber: '0000000000',
            gender: 'Not Specified',
            designation: role,
            dateOfBirth: new Date()
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

// PUT - Update user status
router.put('/users/:id/status', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access denied' });
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.status = status;
        await user.save();
        res.status(200).json({ message: 'User status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status' });
    }
});

// DELETE - Delete a user
router.delete('/users/:id', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Access denied' });
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

export default router;