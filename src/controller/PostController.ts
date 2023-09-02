import { NextFunction, Request, Response } from "express";
import { Like } from "typeorm";
import { AppDataSource } from "../data-source";
import { Post } from "../entity/Post";

export class BlogController {

    private postRepository = AppDataSource.getRepository(Post);

    async findAllPosts(request: Request, response: Response, next: NextFunction) {
        try {
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

            const [posts, total] = await this.postRepository.findAndCount({
                where: whereClause,
                take: limitNum,
                skip,
            });

            response.json({ posts, total });
        } catch (error) {
            next(error);
        }
    }

    async getOnePost(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const post = await this.postRepository.findOne({
            where: { id },
        });

        if (!post) {
            throw Error("This post not exist");
        }
        return post;
    }

    async createPost(request: Request, response: Response, next: NextFunction) {
        const { title, content } = request.body;

        const post = Object.assign(new Post(), {
            title,
            content,
        });

        return this.postRepository.save(post);
    }

    async deletePost(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const post = await this.postRepository.findOne({
            where: { id },
        });

        if (!post) {
            throw Error("This post not exist");
        }

        return "The post has been deleted successfully";
    }

    async updatePost(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const { title, content } = request.body;
        const post = await this.postRepository.findOne({
            where: { id },
        });

        if (!post) {
            throw Error("This post not exist");
        }

        post.title = title;
        post.content = content;

        return this.postRepository.save(post);
    }
}
