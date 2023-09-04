import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const fromUser = process.env.FROM as string;
const jwtsecret = process.env.JWT_SECRET as string;
interface jwtPayload {
    email: string;
    id: number;
}

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, age, email, password } = request.body;

        const userExists = await userRepository.findOne({ where: { email: email } });
        if (userExists) {
            throw Error("This user already exists");
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = Object.assign(new User(), {
            firstName,
            lastName,
            age,
            email,
            password: passwordHash,
            isVerified: false,
        });


        await userRepository.save(user);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return response.json({
            message: "User created successfully, please check your email to verify your account",
            user,
            token,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const loginUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { email, password } = request.body;

        const user = await userRepository.findOne({ where: { email: email, isVerified: true } });

        if (!user) {
            throw Error("This user does not exist or has not been verified");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw Error("Invalid password");
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return response.json({
            message: "User logged in successfully",
            user,
            token

        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}


export const verifyUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const token = request.params.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { id: number };

        const user = await userRepository.findOne({
            where: { id: decodedToken.id }
        });

        if (!user) {
            throw Error("This user does not exist");
        }

        user.isVerified = true;

        await userRepository.save(user);

        return response.json({ message: "User verified successfully" })
    } catch (error) {
        console.log(error);
        next(error);
    }
}


export const findAllUsers = async (request: Request, response: Response, next: NextFunction) => {

    try {
        const token = request.headers.token as string;
        const { id } = jwt.verify(token, jwtsecret) as jwtPayload;
        if (!id) {
            return response.json({ message: "You are not authorized to view this page" })
        }

        const allUsers = await userRepository.find();

        if (allUsers.length === 0) {
            throw new Error("No users found");
        }

        return response.json({
            message: "All users fetched successfully", allUsers
        });
    } catch (error) {
        return next(error);
    }
};

export const getOneUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const token = request.headers.token as string;
        const { id } = jwt.verify(token, jwtsecret) as jwtPayload;
        const user = await userRepository.findOne({
            where: { id }
        })

        if (!user) {
            throw Error("This user not exist");
        }
        return response.json({
            message: "User fetched successfully", user
        });

    } catch (error) {
        return next(error);
    }

}


export const deleteUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const token = request.headers.token as string;
        const { id } = jwt.verify(token, jwtsecret) as jwtPayload;

        const userToRemove = await userRepository.findOneBy({ id })

        if (!userToRemove) {
            throw Error("This user not exist");
        }

        await userRepository.remove(userToRemove)

        return "user has been removed"

    } catch (error) {
        console.log(error)
        return next(error);
    }
}


export const updateUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const token = request.headers.token as string;
        const { id } = jwt.verify(token, jwtsecret) as jwtPayload;

        const userToUpdate = await userRepository.findOneBy({ id })

        if (!userToUpdate) {
            throw Error("This user not exist");
        }


        await userRepository.update(userToUpdate, request.body)

        return "user has been removed"
    } catch (error) {
        console.log(error)
        return next(error);
    }

}

export const changePassword = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const token = request.headers.token as string;
        const { id } = jwt.verify(token, jwtsecret) as jwtPayload;

        const userToUpdate = await userRepository.findOneBy({ id })

        if (!userToUpdate) {
            throw Error("This user not exist");
        }

        const { oldPassword, newPassword } = request.body;

        const isPasswordValid = await bcrypt.compare(oldPassword, userToUpdate.password);

        if (!isPasswordValid) {
            throw Error("Invalid password");
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        userToUpdate.password = passwordHash;

        await userRepository.save(userToUpdate);

        return response.json({ message: "Password has been changed successfully" });
    } catch (error) {
        console.log(error)
        return next(error);
    }
}

