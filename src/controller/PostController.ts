import { NextFunction, Request, Response } from "express";
import { Like } from "typeorm";
import { AppDataSource } from "../data-source";
import { Post } from "../entity/Post";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()


const jwtsecret = process.env.JWT_SECRET as string;
interface jwtPayload {
    id: number;
}


const postRepository = AppDataSource.getRepository(Post);

export const findAllPosts = async (request: Request, response: Response, next: NextFunction) => {
    try {

        const token = request.headers.token as string;
        const { id } = jwt.verify(token, jwtsecret) as jwtPayload;
        if (!id) {
            return response.json({ message: "You are not authorized to view this page" })
        }
        const { page = 1, limit = 10, search } = request.query;
        const pageParam = page as string;
        const pageNum = parseInt(pageParam, 10) || 1;
        const limitParam = limit as string;
        const limitNum = parseInt(limitParam, 10) || 10;
        const skip = (pageNum - 1) * limitNum;
        const whereClause = search
            ? [
                { title: Like(`%${search}%`) },
                { content: Like(`%${search}%`) },
            ]
            : {};

        const [posts, total] = await postRepository.findAndCount({
            where: whereClause,
            take: limitNum,
            skip,
        });

        response.json({ posts, total });
    } catch (error) {
        next(error);
    }
}

export const getOnePost = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const token = request.headers.token as string;
        const { id } = jwt.verify(token, jwtsecret) as jwtPayload;
        if (!id) {
            return response.json({ message: "You are not authorized to view this page" })
        }
        const postId = parseInt(request.params.id);
        const post = await postRepository.findOne({
            where: { id: postId },
        });

        if (!post) {
            throw Error("This post not exist");
        }
        return response.json({ message: "Post fetched successfully", post })

    } catch (error) {
        console.log(error);
        next(error);
    }

}

export const createPost = async (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers.token as string;
    const { id } = jwt.verify(token, jwtsecret) as jwtPayload;
    if (!id) {
        return response.status(401).json({
            message: "You are not authorized to view this page",
        })
    }
    const { title, content } = request.body;

    const post = Object.assign(new Post(), {
        title,
        content,
    });
    await postRepository.save(post);
    return response.json({ message: 'Post created successfully', post }).status(201);

}

export const deletePost = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const token = request.headers.token as string;
        const { id } = jwt.verify(token, jwtsecret) as jwtPayload;
        if (!id) {
            return response.status(401).json({
                message: "You are not authorized to view this page",
            })
        }
        const postId = parseInt(request.params.id);
        const post = await postRepository.findOne({
            where: { id: postId },
        });

        if (!post) {
            return response.status(404).json({ message: "This post not exist" })
        }

        await postRepository.remove(post);
        return response.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const updatePost = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const token = request.headers.token as string;
        const { id } = jwt.verify(token, jwtsecret) as jwtPayload;
        if (!id) {
            return response.json({ message: "You are not authorized to view this page" })
        }
        const postId = parseInt(request.params.id);

        const { title, content } = request.body;
        const post = await postRepository.findOne({
            where: { id: postId },
        });

        if (!post) {
            return response.status(404).json({ message: "This post not exist" })
        }

        post.title = title;
        post.content = content;

        await postRepository.save(post);
        return response.json({ message: 'Post updated successfully', post }).status(201);
    } catch (error) {
        console.log(error);
        next(error);
    }

}

