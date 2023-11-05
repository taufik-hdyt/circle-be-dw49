import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Thread } from "./Thread";
import { Replies } from "./Replies";
import { Like } from "./Likes";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  fullname: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  profile_picture: string;
  @Column({ nullable: true })
  profile_description: string;

  @CreateDateColumn({ type: "time with time zone" })
  createdAt: Date;

   // 1 user bisa memiliki banyak threads
  @OneToMany(() => Thread, (thread) => thread.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  threads: Thread[];

  @OneToMany(() => Replies, (reply) => reply.user)
  replies: Replies[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @ManyToMany(() => User, (user) => user.users)
  @JoinTable({
    name: "following",
    joinColumn: {
      name: "following_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "follower_id",
      referencedColumnName: "id",
    },
  })
  users: User[];
}
