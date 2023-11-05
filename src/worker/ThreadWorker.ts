import { Repository } from "typeorm";
import { Thread } from "../entity/Thread";
import { AppDataSource } from "../data-source";
import { EventEmitter } from "stream";
import cloudinary from "../libs/cloudinary";
import { request } from "http";

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
            const cloudinaryRespone = payload.image ? await cloudinary.destination(
              payload.image
            ) : null
            const thread = this.ThreadRepository.create({
              content: payload.content,
              image: cloudinaryRespone,
              user: {
                id: payload.user,
              },
            });


            await this.ThreadRepository.save(thread);

            // request to server
            const req = request({
              hostname:"localhost",
              port: 5000,
              path:"/api/v1/thread-post",
              method: "GET"
            })
            req.on("error", (error)=>{
              console.log("Error sending request", error);
            })

            console.log("sending request");
            req.end()

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
