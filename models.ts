import { Schema, model } from 'mongoose';

const TaskSchema = new Schema({
    Title: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Due_Date: {
        type: Date,
        required: true
    },
    Completed: {
        type: Boolean,
        default: false
    }
})

export const Task = model('Task', TaskSchema);

module.exports = { Task };