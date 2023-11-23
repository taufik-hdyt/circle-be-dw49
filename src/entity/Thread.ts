import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,ManyToOne, ManyToMany, OneToMany } from "typeorm"
import {User} from './User'
import { Replies } from "./Replies"
import { Like } from "./Likes"

@Entity("threads")
export class Thread {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    content: string

    @Column({nullable: true})
    image: string

    @CreateDateColumn({type: "timestamp with time zone"})
    createdAt : Date
    @UpdateDateColumn({type: "timestamp with time zone"})
    updateAt : Date

    // banyak thread yang dimiliki satu user
    @ManyToOne(()=> User, (user)=> user.threads,{
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    user: User

    @OneToMany(() => Replies, (reply) => reply.thread)
    replies: Replies[];


    @OneToMany(() => Like, (like) => like.thread)
    likes: Like[];
}



