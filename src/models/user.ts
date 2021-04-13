import { createSchema, Type, typedModel, ExtractDoc, ExtractProps } from 'ts-mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import has = Reflect.has;
require('dotenv').config();
export const jwtSecret = process.env.JWT_SECRET || 'somesecret';

export const UserSchema = createSchema(
	{
		email: Type.string({required: true, unique: true}),
		password: Type.string({required: true}),
		firstName: Type.string({required: true}),
		lastName: Type.string({required: true}),
	},
	{ timestamps: { createdAt: true, updatedAt:true } }
);

UserSchema.virtual('id').get(function(this : UserDoc){
	return this._id.toHexString();
});

UserSchema.virtual('fullName').get(function (this: UserDoc){
	return this.firstName + " " + this.lastName;
});

UserSchema.pre('save', async function(this: UserDoc, next: mongoose.HookNextFunction){
	const user = this;
	if(!this.isModified('password')) return next();


	const hash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
	this.password = hash;
	next();
});

export const comparePassword = async function (user: UserDoc, password: string){
	const result = await bcrypt.compareSync(password, user.password);
	return result;
}

export const generateJWT = function (user: UserDoc) {
	const today = new Date();
	const expirationDate = new Date();
	expirationDate.setDate(today.getDate() + 60);

	const payload = {
		id: user.id,
		email: user.email,
		name: user.firstName,
	};


	return jwt.sign(payload,jwtSecret);
}

// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
	virtuals: true
});

export const User = typedModel('User', UserSchema, undefined, undefined);
export type UserDoc = ExtractDoc<typeof UserSchema>;
export type UserProps = ExtractProps<typeof UserSchema>

