import express from 'express';
import EventProposal from '../models/EventProposal.js';
// import ApprovedBudget from '../models/ApprovedBudget.js';
import authenticateJWT from '../middleware/auth.js'; 

const router = express.Router();

// Create Event Proposal Route
router.post('/proposals', async (req, res) => {
    const { userId, eventName, eventDescription, eventDate, totalBudget, breakdown, budgetProposalDate } = req.body;
    try {
        // Validate that the event date is after the budget proposal date
        if (new Date(eventDate) <= new Date(budgetProposalDate)) {
            return res.status(400).json({ message: 'Event date must be after the budget proposal date.' });
        }

        const proposal = new EventProposal({ 
            userId, 
            eventName, 
            eventDescription, 
            eventDate, 
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

// // Get Approved Budgets Route
// router.get('/approved-budgets', async (req, res) => {
//     const { userId } = req.query;
//     try {
//         const budgets = userId 
//             ? await ApprovedBudget.find({ userId }) 
//             : await ApprovedBudget.find();
        
//         res.status(200).json(budgets);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching approved budgets', error });
//     }
// });

// New API route to get approved proposals
router.get('/proposals/approved', async (req, res) => {
    
    try {
        const approvedProposals = await EventProposal.find({ status: 'Accepted' });
        res.status(200).json(approvedProposals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching approved proposals', error });
     }
    //  console.log(approvedProposals);
});

// Accept proposal
router.put('/proposals/:id/accepted', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const proposal = await EventProposal.findById(id);
        if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }

        // Update the proposal status to "Accepted"
        proposal.status = 'Accepted';
        await proposal.save();

        res.status(200).json({ message: 'Proposal accepted', proposal });
    } catch (error) {
        res.status(500).json({ message: 'Failed to accept proposal', error });
    }
});

// // Approve proposal
// router.put('/proposals/:id/approve', authenticateJWT, async (req, res) => {
//     const { id } = req.params;
//     try {
//         const proposal = await EventProposal.findById(id);
//         if (!proposal || proposal.status !== 'Accepted') {
//             return res.status(404).json({ message: 'Proposal not found or not accepted' });
//         }

//         // Update the proposal status to "Approved"
//         proposal.status = 'Approved';
//         await proposal.save();

//         res.status(200).json({ message: 'Proposal approved', proposal });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to approve proposal', error });
//     }
// });

// Reject proposal
router.put('/proposals/:id/rejected', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const proposal = await EventProposal.findById(id);
        if (!proposal) {
            return res.status(404).json({ message: 'Proposal not found' });
        }

        // Update the proposal status to "Rejected"
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
        res.status(200).json(rejectedProposals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rejected proposals', error });
    }
});  

export default router;
