import { Repository } from "typeorm";
import { Thread } from "../entity/Thread";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { createThreadSchema } from "../utils/validator/Thread";
import { User } from "../entity/User";

export default new (class ThreadServices {
  private readonly ThreadRepository: Repository<Thread> =
    AppDataSource.getRepository(Thread);
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const threads = await this.ThreadRepository.find({ relations: ["user"] });
      return res.status(200).json(threads);
    } catch (error) {
      return res.status(500).json({
        Error: "Error while getting threads",
      });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const thread = await this.ThreadRepository.findOne({
        where: {
          id,
        },
        relations: ["user"],
      });
      if (!thread) res.status(404).json({ message: "Not found" });
      return res.status(200).json(thread);
    } catch (error) {
      return res.status(500).json({
        Error: "Error while getting thread",
      });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      // cek validate input body
      const { error, value } = createThreadSchema.validate(data);
      if (error) return res.status(401).json({ Error: error });

      const userSelected = await this.UserRepository.findOne({
        where: {
          id: res.locals.auth.id
        },
      });
      const thread = this.ThreadRepository.create({
        content: value.content,
        image: value.image,
        user: userSelected,
      });

      const createdThread = await this.ThreadRepository.save(thread);
      return res.status(201).json(createdThread);
    } catch (error) {
      return res.status(500).json({
        Error: "Error while creating threads",
      });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const thread = await this.ThreadRepository.findOne({
        where: {
          id,
        },
      });
      if (!thread) return res.status(400).json("Not found");

      await this.ThreadRepository.delete(id);
      res.status(200).json("Deleted");
    } catch (error) {
      return res.status(500).json({
        Error: "Error while creating threads",
      });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const thread = await this.ThreadRepository.findOne({
        where: {
          id,
        },
      });
      thread.content = data.content;
      thread.image = data.image;
      const update = await this.ThreadRepository.save(thread);
      return res.status(200).json(update);
    } catch (error) {
      return res.status(500).json({
        Error: "Error while creating threads",
      });
    }
  }
})();
