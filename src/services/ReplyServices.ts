import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Thread } from "../entity/Thread";
import { User } from "../entity/User";
import { Replies } from "../entity/Replies";
import { Request, Response } from "express";
import { createThreadSchema } from "../utils/validator/Thread";

export default new (class ReplyServices {
  private readonly ReplyRepository: Repository<Replies> =
    AppDataSource.getRepository(Replies);
  private readonly ThreadRepository: Repository<Thread> =
    AppDataSource.getRepository(Thread);
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

    async add(req: Request, res: Response): Promise<Response> {
      try {
        const id = parseInt(req.params.id)
        const userSelected: User | null = await this.UserRepository.findOne({
          where: {
            id: res.locals.auth.id,
          },
          relations: ["threads"]
        });


        // check use yang di pilih
        if (!userSelected) return res.status(404).json({Error: "User not found"})
        const threadSelected: Thread | null = await this.ThreadRepository.findOne(
          {
            where: {
              id
            },
          }
        );

        // check thread yang di pilih
        if (!threadSelected) return res.status(404).json({message: "Thread not found"})
        const { content, image } = req.body;

        const { error } = createThreadSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0] });

        const reply: Replies = new Replies();
        reply.content = content;



        if (image) reply.image = image;
        reply.user = userSelected
        reply.thread = threadSelected;
        await this.ReplyRepository.save(reply);
        return res.status(201).json({
          status: "success",
          message: "Add Reply Success",
          data: reply
        });

      } catch (error) {
        console.log(error);

        return res.status(500).json({
          message: error.message
        })
      }
    }
})();
