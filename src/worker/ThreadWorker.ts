import { Repository } from "typeorm";
import { Thread } from "../entity/Thread";
import { AppDataSource } from "../data-source";
import { EventEmitter } from "stream";
import cloudinary from "../libs/cloudinary";

export default new (class ThreadWorker {
  private readonly ThreadRepository: Repository<Thread> =
    AppDataSource.getRepository(Thread);
  private emitter = new EventEmitter();

  async create(queueName: string, connection: any) {
    try {
      const channel = await connection.createChannel();
      await channel.assertQueue(queueName);
      await channel.consume(queueName, async (message:any) => {
        try {
          if (message !== null) {
            const payload = JSON.parse(message.content.toString());
            const cloudinaryRespone = await cloudinary.destination(
              payload.image
            );
            const thread = this.ThreadRepository.create({
              content: payload.content,
              image: cloudinaryRespone,
              user: {
                id: payload.user,
              },
            });
            console.log(thread);

            const threadResponse = await this.ThreadRepository.save(thread);
            this.emitter.emit("message");
            console.log("(Worker) : Thread is create");
            channel.ack(message);
          }
        } catch (error) {
          console.log(error);
          console.log("(Worker) : Thread is failed");
        }
      });
    } catch (error) {
      console.log("(Worker) : Error while consume queue from thread");
    }
  }
})();
