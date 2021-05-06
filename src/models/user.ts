import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose, {Document} from 'mongoose';
require('dotenv').config();
export const jwtSecret = process.env.JWT_SECRET || 'somesecret';

export interface User extends Document{
	email: string,
	password: string,
	firstName: string,
	lastName: string
}

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true
		},
		password:{
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
	},
	{ timestamps: { createdAt: true, updatedAt:true } }
);

UserSchema.virtual('id').get(function(this : User){
	return this._id.toHexString();
});

UserSchema.virtual('fullName').get(function (this: User){
	return this.firstName + " " + this.lastName;
});

UserSchema.pre('save', async function(this: User, next: mongoose.HookNextFunction){
	const user = this;
	if(!this.isModified('password')) return next();


	const hash = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
	this.password = hash;
	next();
});

export const comparePassword = async function (user: User, password: string): Promise<boolean>{
	console.log(password);
	const result = await bcrypt.compareSync(password, user.password);
	return result;
}

export const generateJWT = function (user: User) {
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

export const UserModel = mongoose.model<User>('User', UserSchema);

