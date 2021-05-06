import express from 'express';
import jwtMiddleware from 'express-jwt';
import {User, UserModel, jwtSecret, generateJWT, comparePassword} from '../models/user';

const buildRouter : Function= (app: express.Application) => {

    app.post("/login", (req: express.Request, res: express.Response) => {
        const {email, password} = req.body;

        UserModel.findOne({email}, (err: any, user: User) => {
            if(err){
                return res.status(500).json({error: err.message});
            }
            if(!user){
                return res.status(404).json({error: {email: "This email is not registered"}});
            }

            comparePassword(user, password).then(result => {
                if(!result){
                    return res.status(400).json({error: {password: 'Wrong password'}});
                }else{
                    return res.status(200).json({user, token: generateJWT(user)});
                }
            })

        })

    });

    app.post("/register", (req: express.Request, res: express.Response) => {
        const userData : User = req.body;


        UserModel.findOne({email: userData.email}, (err: any, foundUser: User) => {
            if(err){
                return res.status(500).json({error: err.message});
            }

            if(foundUser) return res.status(400).json({error: {email: 'This email is already registered'}});

            const user : User = new UserModel(userData);
            user.save((err, newUser) => {
                if(err) return res.status(500).json({error: err.message});

                return res.status(200).json({user, token: generateJWT(user)});
            })

        })
    });

    app.use("/", jwtMiddleware({secret: jwtSecret, algorithms: ['HS256'], resultProperty: 'locals.auth' }).unless({path: ['/login', '/register']}));

}

export default buildRouter;

