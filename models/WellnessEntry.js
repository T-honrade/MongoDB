const mongoose = require("mongoose");

const wellnessEntrySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        activity: {
            type: String,
            required: true,
            trim: true
        },

        mood: {
            type: String,
            required: true
        },

        notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "WellnessEntry",
    wellnessEntrySchema
);