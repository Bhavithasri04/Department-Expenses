import { Schema, model } from 'mongoose';

const EventProposalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventName: { type: String, required: true },
  eventDescription: { type: String, required: true }, 
  eventDate: { type: Date, required: true }, 
  totalBudget: { type: Number, required: true }, 
  breakdown: [{ item: String, cost: Number }], 
  status: { type: String, default: 'Pending' },
});

export default model('EventProposal', EventProposalSchema);
