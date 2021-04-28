"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const databaseHost = process.env.DATABASE_HOST || 'localhost';
const databasePort = process.env.DATABASE_PORT || '27017';
const databaseName = process.env.DATABASE_NAME || 'app';
const databaseUser = process.env.DATABASE_USER;
const databasePassword = process.env.DATABASE_PASSWORD;
const databaseURL = process.env.DATABASE_URL;
if (databaseURL) {
    mongoose_1.default.connect(databaseURL, { useNewUrlParser: true });
}
else {
    if (databaseUser && databasePassword) {
        mongoose_1.default.connect(`mongodb://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseName}?authSource=admin`, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    else {
        mongoose_1.default.connect(`mongodb://${databaseHost}:${databasePort}/${databaseName}?authSource=admin`, { useNewUrlParser: true, useUnifiedTopology: true });
    }
}
const db = mongoose_1.default.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to database'));
