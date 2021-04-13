import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import {httpLogger} from './log';
import userController from './controllers/user';
import taskController from './controllers/task';
import collectionController from './controllers/colection';
import security from './security';
import './mongo';

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(httpLogger);

security(app);

userController(app);
taskController(app);
collectionController(app);

app.listen(process.env.PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${process.env.PORT}`);
});


