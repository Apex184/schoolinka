import * as bodyParser from "body-parser";
import { validationResult } from "express-validator";
import express, { Request, Response, NextFunction } from "express"
import { AppDataSource } from "./data-source";
// import { Routes } from "./routes"
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter';
import postRouter from './routes/postRouter';
import logger from 'morgan';
import cors from 'cors';
import createError from 'http-errors';
import dotenv from 'dotenv';

dotenv.config();


function handleErrors(err: createError.HttpError, req: Request, res: Response, next: NextFunction) {
    res.status(err.statusCode || 500).send({ message: err.message });
};

AppDataSource.initialize().then(async () => {
    const app = express()
    app.use(cookieParser());
    app.use(logger('dev'));
    app.use(cors());
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    const port = process.env.PORT || 9000;

    app.use('/user', userRouter);
    app.use('/blog', postRouter);
    app.use(handleErrors);
    app.listen(port)
    console.log(`Server has started on port ${port}.`)

}).catch(error => console.log(error))


