import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateLoginToken } from '../middleware/loginToken';
import dotenv from 'dotenv'
dotenv.config()

const fromUser = process.env.FROM as string;
const jwtsecret = process.env.JWT_SECRET as string || "examplesecret";
interface jwtPayload {
    id: number;
    email: string;
}

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, age, email, password } = request.body;

        const userExists = await userRepository.findOne({ where: { email: email } });
        if (userExists) {
            return response.status(409).json({ message: "This user already exists" });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = Object.assign(new User(), {
            firstName,
            lastName,
            age,
            email,
            password: passwordHash,
        });


        await userRepository.save(user);
        const token = generateLoginToken({ id: user.id, email: user.email });
        return response.status(201).json({ message: "User created successfulyy", token, user })
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
            return response.status(404).json({ message: "This user does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return response.status(401).json({ message: "Invalid password" });
        }
        const token = generateLoginToken({ id: user.id, secret: jwtsecret });
        // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return response.status(200).json({ message: "User logged in successfully", token, user })
    } catch (error) {
        console.log(error);
        next(error);
    }
}


export const verifyUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const token = request.params.token;
        const { email } = jwt.verify(token, jwtsecret) as jwtPayload;
        if (!email) {
            return response.status(401).json({ message: 'Invalid token' });
        }
        const user = await userRepository.findOne({
            where: { email },
        });

        if (!user) {
            return response.status(404).json({ message: 'This user does not exist' });
        }
        if (user.isVerified) {
            return response.status(409).json({ message: 'This user has already been verified' });
        }

        user.isVerified = true;

        await userRepository.save(user);

        return response.status(200).json({ message: 'User has been verified successfully' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


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
        if (!id) {
            return response.json({ message: "You are not authorized to view this page" })
        }
        const postId = parseInt(request.params.id);
        const user = await userRepository.findOne({
            where: { id: postId }
        })

        if (!user) {
            return response.status(404).json({ message: "This user does not exist" });
        }
        return response.status(200).json({
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

        if (!id) {
            return response.json({ message: "You are not authorized to view this page" })
        }
        const postId = parseInt(request.params.id);
        const userToRemove = await userRepository.findOneBy({ id: postId });

        if (!userToRemove) {
            return response.status(404).json({ message: "This user does not exist" });
        }

        await userRepository.remove(userToRemove)

        return response.status(200).json({ message: "User has been removed" });


    } catch (error) {
        console.log(error)
        return next(error);
    }
}


export const updateUser = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const token = request.headers.token as string;
        const { id } = jwt.verify(token, jwtsecret) as jwtPayload;
        if (!id) {
            return response.json({ message: "You are not authorized to view this page" })
        }
        const postId = parseInt(request.params.id);
        const userToUpdate = await userRepository.findOneBy({ id: postId })

        if (!userToUpdate) {
            return response.status(404).json({ message: "This user does not exist" });
        }


        await userRepository.update(userToUpdate, request.body)

        return response.status(200).json({ message: "User has been updated", });
    } catch (error) {
        console.log(error)
        return next(error);
    }

}

export const changePassword = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const token = request.headers.token as string;
        const { id } = jwt.verify(token, jwtsecret) as jwtPayload;
        if (!id) {
            return response.json({ message: "You are not authorized to view this page" })
        }
        const postId = parseInt(request.params.id);

        const userToUpdate = await userRepository.findOneBy({ id: postId })

        if (!userToUpdate) {
            return response.status(404).json({ message: "This user does not exist" });
        }

        const { oldPassword, newPassword } = request.body;

        const isPasswordValid = await bcrypt.compare(oldPassword, userToUpdate.password);

        if (!isPasswordValid) {
            return response.status(401).json({ message: "Invalid password" });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        userToUpdate.password = passwordHash;

        await userRepository.save(userToUpdate);
        return response.status(200).json({ message: "Password has been changed successfully", });
    } catch (error) {
        console.log(error)
        return next(error);
    }
}

export const resetPassword = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { email } = request.body;

        const user = await userRepository.findOne({ where: { email: email } });

        if (!user) {
            return response.status(404).json({ message: "This user does not exist" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return response.json({
            message: "Please check your email to reset your password",
            token
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

