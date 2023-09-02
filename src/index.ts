import * as bodyParser from "body-parser"
import express, { Request, Response, NextFunction } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import cookieParser from 'cookie-parser';
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

    Routes.forEach(route => {
        (app as any)[route.method](route.route, async (req: Request, res: Response, next: Function) => {
            try {
                const result = await (new (route.controller as any))[route.action](req, res, next)
                res.json(result)
            } catch (error) {
                next(error)
            }

        });
    });
    app.use(handleErrors);
    app.listen(port)
    console.log(`Server has started on port ${port}.`)

}).catch(error => console.log(error))
