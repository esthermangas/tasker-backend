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
exports.UserModel = exports.generateJWT = exports.comparePassword = exports.jwtSecret = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
exports.jwtSecret = process.env.JWT_SECRET || 'somesecret';
const UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
}, { timestamps: { createdAt: true, updatedAt: true } });
UserSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
UserSchema.virtual('fullName').get(function () {
    return this.firstName + " " + this.lastName;
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!this.isModified('password'))
            return next();
        const hash = bcrypt_1.default.hashSync(user.password, bcrypt_1.default.genSaltSync(10));
        this.password = hash;
        next();
    });
});
const comparePassword = function (user, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield bcrypt_1.default.compareSync(password, user.password);
        return result;
    });
};
exports.comparePassword = comparePassword;
const generateJWT = function (user) {
    const today = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(today.getDate() + 60);
    const payload = {
        id: user.id,
        email: user.email,
        name: user.firstName,
    };
    return jsonwebtoken_1.default.sign(payload, exports.jwtSecret);
};
exports.generateJWT = generateJWT;
// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
    virtuals: true
});
exports.UserModel = mongoose_1.default.model('User', UserSchema);
