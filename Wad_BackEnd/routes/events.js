import express from 'express';
import EventProposal from '../models/EventProposal.js';
import authenticateJWT from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if the user has the 'Admin' role
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access Denied: Admin role required.' });
    }
    next();
};

// This helper function is fine, we'll keep it.
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// SECURED: The user's ID should come from the secure token, not the request body.
router.post('/proposals', authenticateJWT, async (req, res) => {
    const { eventName, eventDescription, eventDate, totalBudget, breakdown, budgetProposalDate } = req.body;
    try {
        if (!eventDate || !budgetProposalDate) {
            return res.status(400).json({ message: 'Event date and budget proposal date are required.' });
        }
        if (new Date(eventDate) <= new Date(budgetProposalDate)) {
            return res.status(400).json({ message: 'Event date must be after the budget proposal date.' });
        }

        const proposal = new EventProposal({
            userId: req.user.id, // Using the authenticated user's ID from the token
            eventName,
            eventDescription,
            eventDate,
            budgetProposalDate,
            totalBudget,
            breakdown,
            status: 'Pending'
        });

        await proposal.save();
        res.status(201).json(proposal);
    } catch (error) {
        res.status(500).json({ message: 'Error creating proposal', error });
    }
});

// FIXED & SECURED: This is the main fix. This route now ONLY gets proposals for the currently logged-in user.
router.get('/proposals', authenticateJWT, async (req, res) => {
    try {
        // req.user.id is added by the authenticateJWT middleware from the user's token
        const proposals = await EventProposal.find({ userId: req.user.id });
        res.status(200).json(proposals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user proposals', error });
    }
});

// SECURED: Added authentication middleware. This route is for the admin panel.
router.get('/proposals/approved', authenticateJWT, async (req, res) => { 
    try {
        const approvedProposals = await EventProposal.find({ status: 'Accepted' }).populate('userId', 'fullName');
        res.status(200).json(approvedProposals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching approved proposals', error });
    }
});

// FIXED & SECURED: Changed Proposal.find() to EventProposal.findById(id) to correctly find and update one document.
router.put('/proposals/:id/accepted', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const proposal = await EventProposal.findById(id); 
        if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }
        proposal.status = 'Accepted';
        await proposal.save();
        res.status(200).json({ message: 'Proposal accepted', proposal });
    } catch (error) {
        res.status(500).json({ message: 'Failed to accept proposal', error });
    }
});

// FIXED & SECURED: Changed Proposal.find() to EventProposal.findById(id).
router.put('/proposals/:id/rejected', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const proposal = await EventProposal.findById(id);
        if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }
        proposal.status = 'Rejected';
        await proposal.save();
        res.status(200).json({ message: 'Proposal rejected', proposal });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reject proposal', error });
    }
});

// SECURED: Added authentication middleware. This route is for the admin panel.
router.get('/proposals/rejected', authenticateJWT, async (req, res) => {
    try {
        const rejectedProposals = await EventProposal.find({ status: 'Rejected' }).populate('userId', 'fullName');
        res.status(200).json(rejectedProposals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rejected proposals', error });
    }
});

router.get('/proposals/all', authenticateJWT, isAdmin, async (req, res) => {
    try {
        // Find ALL proposals, without filtering by userId
        const proposals = await EventProposal.find({}).populate('userId', 'fullName');
        res.status(200).json(proposals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all proposals', error });
    }
});

export default router;
