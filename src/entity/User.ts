import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

interface IUser {
    id: number
    firstName: string
    lastName: string
    age: number
    email: string
    password: string
    isVerified: boolean
}
@Entity()
export class User implements IUser {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    lastName: string

    @Column()
    age: number

    @Column({ default: false })
    isVerified: boolean

}
