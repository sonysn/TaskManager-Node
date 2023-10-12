"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPassedDueDate = exports.UpdateDateWorker = exports.DeleteATask = exports.UpdateATask = exports.CreateATask = exports.RetrieveATaskByID = exports.ListAllTasks = void 0;
const models_1 = require("../models");
const redis_config_1 = __importDefault(require("../databases/redis_config"));
const redisTaskListKey = "TaskList";
const ListAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskList = yield redis_config_1.default.HGETALL(redisTaskListKey);
        const tasks = yield models_1.Task.find();
        if (!taskList || Object.keys(taskList).length === 0 || tasks.length != Object.keys(taskList).length) {
            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i];
                yield redis_config_1.default.HSET(redisTaskListKey, task.Title, JSON.stringify(task));
                //Set the expiration time to 1 hour
                redis_config_1.default.EXPIRE(redisTaskListKey, 3600);
            }
            res.json(tasks);
        }
        else {
            // Parse the task list
            const parsedTasks = [];
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
});
exports.ListAllTasks = ListAllTasks;
const RetrieveATaskByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskID } = req.query;
        const task = yield models_1.Task.findById(taskID);
        if (!task) {
            res.sendStatus(404);
        }
        else {
            res.json(task);
        }
    }
    catch (err) {
        res.sendStatus(500);
    }
});
exports.RetrieveATaskByID = RetrieveATaskByID;
const CreateATask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, due_date } = req.body;
        const task = {
            Title: title,
            Description: description,
            Due_Date: due_date,
            Completed: false
        };
        const taskL = new models_1.Task(task);
        yield taskL.save();
        yield redis_config_1.default.HSET(redisTaskListKey, task.Title, JSON.stringify(taskL));
        res.sendStatus(200);
    }
    catch (err) {
        res.sendStatus(500);
    }
});
exports.CreateATask = CreateATask;
const UpdateATask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const { title, description, due_date, completed } = req.body;
        const task = {
            Title: title,
            Description: description,
            Due_Date: due_date,
            Completed: completed
        };
        yield models_1.Task.findByIdAndUpdate(id, task);
        res.sendStatus(200);
    }
    catch (err) {
        res.sendStatus(500);
    }
});
exports.UpdateATask = UpdateATask;
const DeleteATask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        yield models_1.Task.findByIdAndDelete(id);
        res.sendStatus(200);
    }
    catch (err) {
        res.sendStatus(500);
    }
});
exports.DeleteATask = DeleteATask;
// Custom Management Command To marks tasks as completed if their due date has passed
const UpdateDateWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield models_1.Task.find();
        tasks.forEach((task) => __awaiter(void 0, void 0, void 0, function* () {
            if (hasPassedDueDate(task.Due_Date)) {
                yield models_1.Task.findByIdAndUpdate(task._id, { Completed: true });
            }
        }));
        console.log("Midnight Update Complete");
    }
    catch (err) {
        console.log(err);
    }
});
exports.UpdateDateWorker = UpdateDateWorker;
function hasPassedDueDate(dueDate) {
    // Get current date
    const currentDate = new Date();
    // Compare the current date to the target date
    if (currentDate > dueDate) {
        return true;
    }
    else {
        return false;
    }
}
exports.hasPassedDueDate = hasPassedDueDate;
const checkRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield redis_config_1.default.HGETALL(redisTaskListKey);
        return tasks;
    }
    catch (err) {
        console.log(err);
        return;
    }
});
