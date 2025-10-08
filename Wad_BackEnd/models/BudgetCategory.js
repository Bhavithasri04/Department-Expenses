// Wad_BackEnd/models/BudgetCategory.js

import { Schema, model } from 'mongoose';

const BudgetCategorySchema = new Schema({
    fiscalYear: {
        type: Schema.Types.ObjectId,
        ref: 'FiscalYear', // Links this category to a specific fiscal year
        required: true
    },
    name: {
        type: String,
        required: true
    },
    allocatedAmount: {
        type: Number,
        required: true,
        default: 0
    }
});

export default model('BudgetCategory', BudgetCategorySchema);