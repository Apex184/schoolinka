import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import configDotenv from 'dotenv';

configDotenv.config();
const secret = process.env.JWT_SECRET as string;

interface jwtPayload {
    id: number;
    email: string;
}



export async function isAuthorized(req: Request | any, res: Response, next: NextFunction) {
    try {
        const token = req.headers.token as string;
        if (!token) {
            res.status(httpStatus.UNAUTHORIZED).json({
                Error: 'Kindly sign in as a User',
            });
            return;
        }
        const verified = jwt.verify(token, secret) as jwtPayload;

        if (!verified) {
            return res.status(httpStatus.UNAUTHORIZED).json({ Error: 'User not verified, you cannot access this route' });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(httpStatus.FORBIDDEN).json({ Error: 'User is not logged in' });
    }
}