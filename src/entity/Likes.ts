import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Thread } from "./Thread";

@Entity("likes")
export class Like {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn({ type: "time with time zone" })
  createdAt: Date;
  @UpdateDateColumn({ type: "time with time zone" })
  updateAt: Date;

  @ManyToOne(() => User, (user) => user.likes, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Thread, (thread) => thread.likes, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "thread_id" })
  thread: Thread;
}
