import { Repository } from "typeorm"
import { User } from "../entity/User"
import { AppDataSource } from "../data-source"
import { Request, Response } from "express"
import { createUserSchema } from "../utils/validator/User"

export default new class UserServices{
  private readonly UserRepository: Repository<User> = AppDataSource.getRepository(User)

  async find(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.UserRepository.find();
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({
        Error: "Error while getting threads",
      });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      // cek validate input body
      const { error, value } = createUserSchema.validate(data);
      if (error) return res.status(401).json({ Error: error });

      const user = this.UserRepository.create({
        fullname: value.fullname,
        email: value.email,
        password: value.password,
        profile_picture: value.profile_picture,
        profile_description: value.profile_description,
        username: value.username
      });

      const createdUser = await this.UserRepository.save(user)
      return res.status(201).json(createdUser)
    } catch (error) {
      return res.status(500).json({
        Error: "Error while creating user",
      });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id)
      const thread = await this.UserRepository.findOne({
        where: {
          id
        }
      })
      if(!thread) res.status(404).json({message: "Not found"})
      return res.status(200).json(thread);
    } catch (error) {
      return res.status(500).json({
        Error: "Error while getting thread",
      });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id)
      const thread = await this.UserRepository.findOne({
        where: {
          id
        }
      })
      if(!thread) return res.status(400).json("Not found")

      await this.UserRepository.delete(id)
      res.status(200).json("Deleted")

    } catch (error) {
      return res.status(500).json({
        Error: "Error while creating threads",
      });
    }
  }


  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id)
      const data = req.body;
      const user = await this.UserRepository.findOne({
        where: {
          id
        }
      })
      user.fullname = data.fullname
      user.email = data.email
      user.password = data.password
      user.profile_picture = data.profile_picture
      user.profile_description = data.profile_description
      user.username = data.username
      const update = await this.UserRepository.save(user)
      return res.status(200).json(update)
    } catch (error) {
      return res.status(500).json({
        Error: "Error while creating User",
      });
    }
  }


}