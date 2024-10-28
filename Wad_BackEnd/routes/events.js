import express from 'express';
import EventProposal from '../models/EventProposal.js';
import authenticateJWT from '../middleware/auth.js';

const router = express.Router();

// Function to format date to "DD-MM-YYYY"
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

// Create Event Proposal Route
router.post('/proposals', async (req, res) => {
    const { userId, eventName, eventDescription, eventDate, totalBudget, breakdown, budgetProposalDate } = req.body;
    try {
        // Check if eventDate and budgetProposalDate are provided
        if (!eventDate || !budgetProposalDate) {
            return res.status(400).json({ message: 'Event date and budget proposal date are required.' });
        }

        // Validate that the event date is after the budget proposal date
        if (new Date(eventDate) <= new Date(budgetProposalDate)) {
            return res.status(400).json({ message: 'Event date must be after the budget proposal date.' });
        }

        // Create the proposal without formatting dates
        const proposal = new EventProposal({
            userId,
            eventName,
            eventDescription,
            eventDate, // Use raw date
            budgetProposalDate, // Use raw date
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

// Get Event Proposals Route
router.get('/proposals', async (req, res) => {
    const { userId } = req.query;
    try {
        const proposals = userId 
            ? await EventProposal.find({ userId, status: 'Pending' }) 
            : await EventProposal.find();
        
        res.status(200).json(proposals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching proposals', error });
    }
});

// New API route to get approved proposals
router.get('/proposals/approved', async (req, res) => { 
    try {
        const approvedProposals = await EventProposal.find({ status: 'Accepted' });
        const formattedProposals = approvedProposals.map(proposal => ({
            ...proposal.toObject(),
            eventDate: formatDate(proposal.eventDate),
            budgetProposalDate: formatDate(proposal.budgetProposalDate)
        }));
        res.status(200).json(formattedProposals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching approved proposals', error });
    }
});

// Accept proposal
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

// Reject proposal
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

// Get Rejected Proposals Route
router.get('/proposals/rejected', async (req, res) => {
    try {
        const rejectedProposals = await EventProposal.find({ status: 'Rejected' });
        const formattedProposals = rejectedProposals.map(proposal => ({
            ...proposal.toObject(),
            eventDate: formatDate(proposal.eventDate),
            budgetProposalDate: formatDate(proposal.budgetProposalDate)
        }));
        res.status(200).json(formattedProposals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rejected proposals', error });
    }
});

export default router;
