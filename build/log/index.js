"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const morgan_1 = __importDefault(require("morgan"));
exports.logger = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)),
    transports: [
        new winston_1.default.transports.Console()
    ]
});
const stream = {
    write: (message) => {
        exports.logger.info(message.substring(0, message.lastIndexOf('\n')));
    }
};
exports.httpLogger = morgan_1.default(':method :url :status :response-time ms - :res[content-length]', { stream });
