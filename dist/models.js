"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const TaskSchema = new mongoose_1.Schema({
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
});
exports.Task = (0, mongoose_1.model)('Task', TaskSchema);
module.exports = { Task: exports.Task };
