import {Task, TaskDoc, TaskProps, TaskSchema} from '../models/task';
import express from 'express';

const getTask = (req : express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    Task.findById(id, null , {}, (err, task)=>{
        if(err)
            return res.status(500).json({error: err.message});

        if(!task){
            return res.status(404).json({error: "Task not found"});
        }
        if(res.locals.auth.id !== task.user.toString()) {
           return  res.status(403).json({error: "You're not the owner of this task"})
        }
        res.locals.task = task;
        next();
    });
}

const buildRouter = (app: express.Application) => {
    app.get('/task', (req: express.Request ,res: express.Response)=> {
        const urlParams = req.query;

        const databaseQuery = {
            user: res.locals.auth.id,
        }

        Object.keys(urlParams).forEach((key) => {
            if(TaskSchema.paths.hasOwnProperty(key)) {
                // @ts-ignore
                databaseQuery[key] = urlParams[key];
            }
        });
        const from = urlParams.from;
        const to = urlParams.to;
        if (from) {
            // @ts-ignore
            databaseQuery['date'] = { $gte: from, $lte: to }
        }
        console.log(databaseQuery);
        Task.find(databaseQuery, (err, tasks) => {
            if(err)
                return res.status(500).json({error: err.message});
            return res.status(200).json(tasks);
        });
    });

    app.get('/task/:id', getTask, (req: express.Request ,res: express.Response) => {
        const task : TaskDoc = res.locals.task;
        return res.status(200).json(task);
    });

    app.post('/task', (req: express.Request ,res: express.Response)=> {
        const body = req.body;
        const task : TaskDoc = new Task(body);
        task.user = res.locals.auth.id;
        task.save({}, (err, newTask) => {
            if(err)
                return res.status(500).json({error: err.message});

            return res.status(201).json(newTask);
        });
    });

    app.patch('/task/:id', getTask, (req: express.Request ,res: express.Response)=> {
        req.body.user = res.locals.auth.id;
        Task.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, (err, task)=>{
            if(err)
                return res.status(500).json({error: err.message});

            return res.status(200).json(task);
        });
    });

    app.delete('/task/:id', getTask, (req:express.Request, res: express.Response)=> {
        Task.findOneAndDelete({_id: req.params.id},{}, (err, task)=>{
            if(err)
                return res.status(500).json({error: err.message});

            return res.status(200).json(task);
        });
    });
}

export default buildRouter;
