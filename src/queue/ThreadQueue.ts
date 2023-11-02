import { Request, Response } from "express";
import { createThreadSchema } from "../utils/validator/Thread";
import MessageQueue from '../libs/rabbitmq'

type QueuePayload = {
  content: string;
  image: string;
  user: number;
};

export default new (class ThreadQueue {
  async create(req: Request, res: Response) {
    try {
      const logginSession: any = res.locals.auth;

      const data = {
        content: req.body.content,
        image: res.locals.filename,
      };

      const { error, value } = createThreadSchema.validate(data);
      if (error)
        return res.status(400).json({
          message: error.details[0].message,
        });

      const payload: QueuePayload = {
        content: data.content,
        image:  data.image ,
        user: logginSession.id,
      };
        const errorQueue = await  MessageQueue.MessageSend("threads-queue", payload)
        if(errorQueue) return res.status(500).json({
          message: "something error while sending message queue"
        })

      return res.status(201).json({
        message: "Thread is queue !",
        payload
      })
    } catch (error) {
      return res.status(500).json({ message: "error in threadqueue method" });
    }
  }
})();
