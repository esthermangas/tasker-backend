"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const getUser = (req, res, next) => {
    const id = req.params.id;
    user_1.UserModel.findById(id, null, {}, (err, user) => {
        if (err)
            return res.status(500).json({ error: err.message });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (res.locals.auth.id !== user.id) {
            return res.status(403);
        }
        res.locals.user = user;
        next();
    });
};
const buildRouter = (app) => {
    app.get('/user', (req, res) => {
        user_1.UserModel.find((err, users) => {
            if (err)
                return res.status(500).json({ error: err.message });
            return res.status(200).json(users);
        });
    });
    app.get('/user/:id', getUser, (req, res) => {
        const user = res.locals.user;
        return res.status(200).json(user);
    });
    app.post('/user', (req, res) => {
        const body = req.body;
        const user = new user_1.UserModel(body);
        user.save({}, (err, newUser) => {
            if (err)
                return res.status(500).json({ error: err.message });
            return res.status(201).json(newUser);
        });
    });
    app.patch('/user/:id', getUser, (req, res) => {
        user_1.UserModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, user) => {
            if (err)
                return res.status(500).json({ error: err.message });
            return res.status(200).json(user);
        });
    });
    app.delete('/user/:id', getUser, (req, res) => {
        user_1.UserModel.findOneAndDelete({ _id: req.params.id }, {}, (err, user) => {
            if (err)
                return res.status(500).json({ error: err.message });
            return res.status(204).send();
        });
    });
};
exports.default = buildRouter;
