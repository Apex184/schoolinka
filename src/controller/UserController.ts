import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async findAllUsers(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    async getOneUser(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)
        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            throw Error("This user not exist");
        }
        return user
    }

    async createUser(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, age } = request.body;

        const user = Object.assign(new User(), {
            firstName,
            lastName,
            age
        })


        return this.userRepository.save(user)
    }

    async deleteUser(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        const userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            throw Error("This user not exist");
        }

        await this.userRepository.remove(userToRemove)

        return "User has been removed successfully"
    }

    async updateUser(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        const userToUpdate = await this.userRepository.findOneBy({ id })

        if (!userToUpdate) {
            throw Error("This user not exist");
        }


        await this.userRepository.update(userToUpdate, request.body)

        return "User data updated successfully"
    }

}