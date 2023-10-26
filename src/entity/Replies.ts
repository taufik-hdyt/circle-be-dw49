import { Entity,  Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"
import { Thread } from "./Thread"

@Entity("replies")
export class Replies {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    image: string
    @Column()
    content: string
    @CreateDateColumn({type: "time with time zone"})
    createdAt : Date
    @UpdateDateColumn({type: "time with time zone"})
    updateAt : Date
    @ManyToOne(()=> User, (user)=>user.replies,{
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    @JoinColumn({name: "user_id"})
    user: User
    @ManyToOne(()=> Thread, (thread)=> thread.replies)
    @JoinColumn({name: "thread_id"})
    thread: Thread

}

