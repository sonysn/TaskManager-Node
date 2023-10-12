import express from 'express';
import { CreateATask, DeleteATask, ListAllTasks, RetrieveATaskByID, UpdateATask } from './controllers/cts';

// Create an instance of the Express router
const router = express.Router();

//List all Tasks endpoint
router.get('/list', ListAllTasks);

//Retrieve a single task by ID endpoint
router.get('/retrieve', RetrieveATaskByID);

//Create a new task endpoint
router.post('/create', CreateATask);

//Update an existing task endpoint
router.put('/update', UpdateATask);

//Delete a task endpoint
router.delete('/delete', DeleteATask);

module.exports = router;