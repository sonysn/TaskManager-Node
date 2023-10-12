import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import redisClient from './databases/redis_config';
import { mongoConnect } from './databases/mongo_config';
import cron from 'node-cron';
import { UpdateDateWorker } from "./controllers/cts";


dotenv.config();

const app: Express = express();

//Redis connection
redisClient.connect();

//MongoDB connection
mongoConnect();

//Run the worker daily at midnight
cron.schedule('0 0 * * *', UpdateDateWorker);

//Port
const port = process.env.PORT || 9000;

//App listen
app.listen(port, () => {
  console.log(`A Node JS TaskManager API is listening on port: ${port}`)
})

//Router
const routes = require('./router');

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/', routes);