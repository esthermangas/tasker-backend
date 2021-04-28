"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = require("../models/task");
const getTask = (req, res, next) => {
    const id = req.params.id;
    task_1.TaskModel.findById(id, null, {}, (err, task) => {
        if (err)
            return res.status(500).json({ error: err.message });
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        if (res.locals.auth.id !== task.user.toString()) {
            return res.status(403).json({ error: "You're not the owner of this task" });
        }
        res.locals.task = task;
        next();
    });
};
const buildRouter = (app) => {
    app.get('/task', (req, res) => {
        const urlParams = req.query;
        const databaseQuery = {
            user: res.locals.auth.id,
        };
        Object.keys(urlParams).forEach((key) => {
            if (task_1.TaskSchema.paths.hasOwnProperty(key)) {
                // @ts-ignore
                databaseQuery[key] = urlParams[key];
            }
        });
        const from = urlParams.from;
        const to = urlParams.to;
        if (from) {
            // @ts-ignore
            databaseQuery['date'] = { $gte: from, $lte: to };
        }
        task_1.TaskModel.find(databaseQuery, (err, tasks) => {
            if (err)
                return res.status(500).json({ error: err.message });
            return res.status(200).json(tasks);
        });
    });
    app.get('/task/:id', getTask, (req, res) => {
        const task = res.locals.task;
        return res.status(200).json(task);
    });
    app.post('/task', (req, res) => {
        const body = req.body;
        const task = new task_1.TaskModel(body);
        task.user = res.locals.auth.id;
        task.save({}, (err, newTask) => {
            if (err)
                return res.status(500).json({ error: err.message });
            return res.status(201).json(newTask);
        });
    });
    app.patch('/task/:id', getTask, (req, res) => {
        req.body.user = res.locals.auth.id;
        task_1.TaskModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, task) => {
            if (err)
                return res.status(500).json({ error: err.message });
            return res.status(200).json(task);
        });
    });
    app.delete('/task/:id', getTask, (req, res) => {
        task_1.TaskModel.findOneAndDelete({ _id: req.params.id }, {}, (err, task) => {
            if (err)
                return res.status(500).json({ error: err.message });
            return res.status(200).json(task);
        });
    });
};
exports.default = buildRouter;
