import { Task } from "../models";
import { Request, Response } from "express";
import redisClient from "../databases/redis_config";

const redisTaskListKey = "TaskList";

/**
 * Retrieves a list of all tasks from the Redis cache and the database.
 * if the Redis cache is empty, the database is queried and the tasks are stored in the Redis cache for 1 hour.
 */
export const ListAllTasks = async (req: Request, res: Response) => {
    try {
        const taskList = await redisClient.HGETALL(redisTaskListKey)
        const tasks = await Task.find();

        if (!taskList || Object.keys(taskList).length === 0 || tasks.length != Object.keys(taskList).length) {
            

            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i];
                await redisClient.HSET(redisTaskListKey, task.Title, JSON.stringify(task));

                //Set the expiration time to 1 hour
                redisClient.EXPIRE(redisTaskListKey, 3600);
            }

            res.json(tasks);
        } else {
            // Parse the task list
            const parsedTasks: any[] = [];

            for (let i = 0; i < Object.keys(taskList).length; i++) {
                const taskKey = Object.keys(taskList)[i];
                const task = JSON.parse(taskList[taskKey]);
                parsedTasks.push(task);
            }

            res.send(parsedTasks);
        }
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

/**
 * Retrieves a task by its ID from the database
 */
export const RetrieveATaskByID = async (req: Request, res: Response) => {
    try {
        const { taskID } = req.query;

        const task = await Task.findById(taskID);

        if (!task) {
            res.sendStatus(404);
        } else {
            res.json(task);
        }
    } catch (err) {
        res.sendStatus(500);
    }
}

/**
 * Creates a new task in the database
 */
export const CreateATask = async (req: Request, res: Response) => {
    try {
        const { title, description, due_date } = req.body;

        const task = {
            Title: title,
            Description: description,
            Due_Date: due_date,
            Completed: false
        }

        const taskL = new Task(task);
        await taskL.save();
        await redisClient.HSET(redisTaskListKey, task.Title, JSON.stringify(taskL));

        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
}

/**
 * Find a task by its ID from the database and update it
 */
export const UpdateATask = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        const { title, description, due_date, completed } = req.body;

        const task = {
            Title: title,
            Description: description,
            Due_Date: due_date,
            Completed: completed
        }

        await Task.findByIdAndUpdate(id, task);

        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
}

/**
 * Deletes a task by its ID from the database
 */
export const DeleteATask = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        await Task.findByIdAndDelete(id);

        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
}


/**
 * The function updates the status of tasks that have passed their due date to completed.
 */
export const UpdateDateWorker = async () => {
    try {
        const tasks = await Task.find();

        tasks.forEach(async (task) => {
            if (hasPassedDueDate(task.Due_Date)) {
                await Task.findByIdAndUpdate(task._id, { Completed: true });
            }
        })
        console.log("Midnight Update Complete");
    }
    catch (err) {
        console.log(err);
    }
}


/**
 * The function checks if a given due date has passed the current date.
 * @param {Date} dueDate - The `dueDate` parameter is a `Date` object that represents the target date
 * for comparison.
 * @returns a boolean value. It returns true if the current date is greater than the due date,
 * indicating that the due date has passed. Otherwise, it returns false.
 */
export function hasPassedDueDate(dueDate: Date) {
    // Get current date
    const currentDate = new Date();

    // Compare the current date to the target date
    if (currentDate > dueDate) {
        return true;
    } else {
        return false;
    }
}