import { Repository } from "typeorm";
import { Thread } from "../entity/Thread";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { createThreadSchema } from "../utils/validator/Thread";
import { User } from "../entity/User";
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs'

export default new (class ThreadServices {
  private readonly ThreadRepository: Repository<Thread> =
    AppDataSource.getRepository(Thread);
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async find(req: Request, res: Response): Promise<Response> {
    try {
      // let page = req.query.page === "" ? parseInt(req.query.page, 10) : 1;
      // page = page > 1 ? page : 1;

      const threads: Thread[] = await this.ThreadRepository.find({
        relations: ["user", "likes.user", "replies"],
        order: { createdAt: "DESC" },
        // take: 10,,
        // skip:page,
        select: {
          user: {
            id: true,
            username: true,
            fullname: true,
            profile_picture: true
          }
        }
      });

      const threadsData = threads.map((thread) => {
        return {
          ...thread,
          likes: thread.likes,
          replies: thread.replies
        };
      });
      return res.status(200).json({
        message: "Success",
        data: threadsData,
      });

    } catch (error) {
      return res.status(500).json({
        message: error.message
      })
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const thread = await this.ThreadRepository.findOne({
        where: {
          id,
        },
        relations: ["user", "likes.user", "replies.user"],
        select: {
          user: {
            id: true,
            username: true,
            fullname: true,
            profile_picture: true,
          },
        },
      });

      if (!thread) return res.status(404).json({
        message: "Data Not Found"
      });
      return res.status(200).json(thread);
    } catch (error) {
      return res.status(500).json({
        message: error.message
      })
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      // const image = res.locals.filename
      const data = req.body
      // cek validate input body
      if(data.content === "" && data.image === "") return res.status(400).json({message: "image or content not empty"})
      const userSelected = await this.UserRepository.findOne({
        where: {
          id: res.locals.auth.id,
        },
      });

      const thread = this.ThreadRepository.create({
        content: data.content,
        image: data.image,
        user: userSelected,
      });

      const createdThread = await this.ThreadRepository.save(thread);
      return res.status(201).json(createdThread);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message
      })
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
      if (!thread) return res.status(404).json({
        message: "Data Not Found"
      });

      await this.ThreadRepository.delete(id);
      res.status(200).json("Deleted");
    } catch (error) {
      return res.status(500).json({
        message: error.message
      })
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
        message: error.message
      })
    }
  }



  async threadPost(req: Request, res: Response): Promise<Response> {
    try {
      const image = res.locals.filename
      const user = res.locals.logginSession
      const data = {
        content: req.body.content,
        image
      }
      // cek validate input body
      const { error } = createThreadSchema.validate(data);
      if (error) return res.status(400).json({ Error: error.details[0] });

      const cloudinaryResponse = await cloudinary.uploader.upload("src/uploads/" + image, {folder: "circle-app"})

      const thread = this.ThreadRepository.create({
        content: data.content,
        image: cloudinaryResponse.secure_ur,
        user: {
          id: user.user.id
        }
      })
      const createThread = await this.ThreadRepository.save(thread)


      return res.status(201).json(createThread)
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message
      })
    }
  }

})();
