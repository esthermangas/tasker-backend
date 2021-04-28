"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const log_1 = require("./log");
const user_1 = __importDefault(require("./controllers/user"));
const task_1 = __importDefault(require("./controllers/task"));
const colection_1 = __importDefault(require("./controllers/colection"));
const security_1 = __importDefault(require("./security"));
require("./mongo");
dotenv_1.default.config();
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(cors_1.default());
app.use(log_1.httpLogger);
security_1.default(app);
user_1.default(app);
task_1.default(app);
colection_1.default(app);
app.listen(process.env.PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${process.env.PORT}`);
});
