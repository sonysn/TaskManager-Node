"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cts_1 = require("./controllers/cts");
// Create an instance of the Express router
const router = express_1.default.Router();
//List all Tasks endpoint
router.get('/list', cts_1.ListAllTasks);
//Retrieve a single task by ID endpoint
router.get('/retrieve', cts_1.RetrieveATaskByID);
//Create a new task endpoint
router.post('/create', cts_1.CreateATask);
//Update an existing task endpoint
router.post('/update', cts_1.UpdateATask);
//Delete a task endpoint
router.get('/delete', cts_1.DeleteATask);
module.exports = router;
