import "reflect-metadata"
import { DataSource } from "typeorm"
import { Thread } from "./entity/Thread"
import { User } from "./entity/User"
import { Replies } from "./entity/Replies"
import { Like } from "./entity/Likes"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "ep-fragrant-bush-09941286.us-east-2.aws.neon.tech",
    port: 5432,
    username: "taufik-hdyt",
    password: "QNp8YA2bSzse",
    database: "thread-apps",
    ssl: true,
    synchronize: true,
    logging: false,
    entities: [User,Thread,Replies,Like],
    migrations: ['src/migration/*.ts'],
    subscribers: [],
})
