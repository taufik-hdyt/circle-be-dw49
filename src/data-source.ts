import "reflect-metadata"
import { DataSource } from "typeorm"
import { Thread } from "./entity/Thread"
import { User } from "./entity/User"
import { Replies } from "./entity/Replies"
import { Like } from "./entity/Likes"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "11111",
    database: "thread-apps",
    synchronize: true,
    logging: false,
    entities: [User,Thread,Replies,Like],
    migrations: ['src/migration/*.ts'],
    subscribers: [],
})
