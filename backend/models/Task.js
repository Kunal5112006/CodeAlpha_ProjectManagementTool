const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        default: "Pending"
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    comments: [
        {
            text: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);