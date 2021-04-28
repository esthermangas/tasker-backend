"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colection_1 = require("../models/colection");
const getColection = (req, res, next) => {
    const id = req.params.id;
    colection_1.ColectionModel.findById(id, null, {}, (err, colection) => {
        if (err)
            return res.status(500).json({ error: err.message });
        if (!colection) {
            return res.status(404).json({ error: "Colection not found" });
        }
        if (res.locals.auth.id !== colection.user.toString()) {
            return res.status(403).json({ error: "You're not the owner of this colection" });
        }
        res.locals.colection = colection;
        next();
    });
};
const buildRouter = (app) => {
    app.get('/colection', (req, res) => {
        const urlParams = req.query;
        const databaseQuery = {
            user: res.locals.auth.id,
        };
        Object.keys(urlParams).forEach((key) => {
            if (colection_1.ColectionSchema.paths.hasOwnProperty(key)) {
                // @ts-ignore
                databaseQuery[key] = urlParams[key];
            }
        });
        if (urlParams._id) {
            // @ts-ignore
            databaseQuery['_id'] = urlParams._id;
        }
        if (urlParams.idIn) {
            // @ts-ignore
            databaseQuery['_id'] = urlParams.idIn.split(',');
        }
        colection_1.ColectionModel.find(databaseQuery, (err, colections) => {
            if (err)
                return res.status(500).json({ error: err.message });
            return res.status(200).json(colections);
        });
    });
    app.get('/colection/:id', getColection, (req, res) => {
        const colection = res.locals.colection;
        return res.status(200).json(colection);
    });
    app.post('/colection', (req, res) => {
        const body = req.body;
        body.user = res.locals.auth.id;
        const colection = new colection_1.ColectionModel(body);
        colection.save({}, (err, newColection) => {
            if (err)
                return res.status(500).json({ error: err.message });
            return res.status(201).json(newColection);
        });
    });
    app.patch('/colection/:id', getColection, (req, res) => {
        req.body.user = res.locals.auth.id;
        colection_1.ColectionModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, colection) => {
            if (err)
                return res.status(500).json({ error: err.message });
            return res.status(200).json(colection);
        });
    });
    app.delete('/colection/:id', getColection, (req, res) => {
        colection_1.ColectionModel.findOneAndDelete({ _id: req.params.id }, {}, (err, colection) => {
            if (err)
                return res.status(500).json({ error: err.message });
            return res.status(200).json(colection);
        });
    });
};
exports.default = buildRouter;
