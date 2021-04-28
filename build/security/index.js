"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = __importDefault(require("express-jwt"));
const user_1 = require("../models/user");
const buildRouter = (app) => {
    app.post("/login", (req, res) => {
        const { email, password } = req.body;
        user_1.UserModel.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!user) {
                return res.status(404).json({ error: { email: "This email is not registered" } });
            }
            if (!user_1.comparePassword(user, password)) {
                return res.status(400).json({ error: { password: 'Wrong password' } });
            }
            else {
                return res.status(200).json({ user, token: user_1.generateJWT(user) });
            }
        });
    });
    app.post("/register", (req, res) => {
        const userData = req.body;
        user_1.UserModel.findOne({ email: userData.email }, (err, foundUser) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (foundUser)
                return res.status(400).json({ error: { email: 'This email is already registered' } });
            const user = new user_1.UserModel(userData);
            user.save((err, newUser) => {
                if (err)
                    return res.status(500).json({ error: err.message });
                return res.status(200).json({ user, token: user_1.generateJWT(user) });
            });
        });
    });
    app.use("/", express_jwt_1.default({ secret: user_1.jwtSecret, algorithms: ['HS256'], resultProperty: 'locals.auth' }).unless({ path: ['/login', '/register'] }));
};
exports.default = buildRouter;
