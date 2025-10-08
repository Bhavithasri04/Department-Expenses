// Wad_BackEnd/models/FiscalYear.js

import { Schema, model } from 'mongoose';

const FiscalYearSchema = new Schema({
    year: {
        type: Number,
        required: true,
        unique: true // Ensures you can only have one budget document per year
    },
    totalBudget: {
        type: Number,
        required: true,
        default: 0
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

export default model('FiscalYear', FiscalYearSchema);