import {Colection, ColectionDoc, ColectionProps, ColectionSchema} from '../models/colection';
import express from 'express';
import {TaskSchema} from "../models/task";

const getColection = (req : express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    Colection.findById(id, null , {}, (err, colection)=>{
        if(err)
            return res.status(500).json({error: err.message});

        if(!colection){
            return res.status(404).json({error: "Colection not found"});
        }
        if(res.locals.auth.id !== colection.user.toString()) {
            return  res.status(403).json({error: "You're not the owner of this colection"})
        }
        res.locals.colection = colection;
        next();
    });
}

const buildRouter = (app: express.Application) => {
    app.get('/colection', (req: express.Request ,res: express.Response)=> {
        const urlParams = req.query;
        const databaseQuery = {
            user: res.locals.auth.id,
        }
        Object.keys(urlParams).forEach((key) => {
            if(ColectionSchema.paths.hasOwnProperty(key)) {
                // @ts-ignore
                databaseQuery[key] = urlParams[key];
            }
        });
        if(urlParams._id){
            // @ts-ignore
            databaseQuery['_id'] = urlParams._id;
        }
        if(urlParams.idIn){
            // @ts-ignore
            databaseQuery['_id'] = urlParams.idIn.split(',');
        }
        Colection.find(databaseQuery,(err, colections) => {
            if(err)
                return res.status(500).json({error: err.message});

            return res.status(200).json(colections);
        });
    });

    app.get('/colection/:id', getColection, (req: express.Request ,res: express.Response) => {
        const colection : ColectionDoc = res.locals.colection;
        return res.status(200).json(colection);
    });

    app.post('/colection', (req: express.Request ,res: express.Response)=> {
        const body = req.body;
        body.user = res.locals.auth.id;
        const colection : ColectionDoc = new Colection(body);

        colection.save({}, (err, newColection) => {
            if(err)
                return res.status(500).json({error: err.message});

            return res.status(201).json(newColection);
        });
    });

    app.patch('/colection/:id', getColection, (req: express.Request ,res: express.Response)=> {
        req.body.user = res.locals.auth.id;
        Colection.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, (err, colection)=>{
            if(err)
                return res.status(500).json({error: err.message});

            return res.status(200).json(colection);
        });
    });

    app.delete('/colection/:id', getColection, (req:express.Request, res: express.Response)=> {
        Colection.findOneAndDelete({_id: req.params.id},{}, (err, colection)=>{
            if(err)
                return res.status(500).json({error: err.message});
            return res.status(200).json(colection);
        });
    });
}

export default buildRouter;
