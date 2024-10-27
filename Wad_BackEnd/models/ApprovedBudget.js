import { Schema, model } from 'mongoose';

const ApprovedBudgetSchema = new Schema({
  eventName: { type: String, required: true },
  amount: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default model('ApprovedBudget', ApprovedBudgetSchema);
