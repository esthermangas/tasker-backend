import {User, UserDoc, UserProps} from '../models/user';
import express from 'express';

const getUser = (req : express.Request, res: express.Response, next: express.NextFunction) => {
  const id = req.params.id;
  User.findById(id, null , {}, (err, user)=>{
    if(err)
      return res.status(500).json({error: err.message});

    if(!user){
      return res.status(404).json({error: "User not found"});
    }
    if(res.locals.auth.id !== user.id) {
      return  res.status(403);
    }
    res.locals.user = user;
    next();
  });
}


const buildRouter = (app: express.Application) => {

  app.get('/user', (req: express.Request ,res: express.Response)=> {
    User.find((err, users) => {
      if(err)
        return res.status(500).json({error: err.message});

      return res.status(200).json(users);
    });
  });

  app.get('/user/:id', getUser, (req: express.Request ,res: express.Response) => {
    const user : UserDoc = res.locals.user;
    return res.status(200).json(user);
  });

  app.post('/user', (req: express.Request ,res: express.Response)=> {
    const body = req.body;
    const user : UserDoc = new User(body);

    user.save({}, (err, newUser) => {
      if(err)
        return res.status(500).json({error: err.message});

      return res.status(201).json(newUser);
    });
  });

  app.patch('/user/:id', getUser, (req: express.Request ,res: express.Response)=> {
    User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, (err, user)=>{
      if(err)
        return res.status(500).json({error: err.message});

      return res.status(200).json(user);
    });
  });

  app.delete('/user/:id', getUser, (req:express.Request, res: express.Response)=> {
    User.findOneAndDelete({_id: req.params.id},{}, (err, user)=>{
      if(err)
        return res.status(500).json({error: err.message});
      return res.status(204).send();
    });
  });

}





export default buildRouter;




