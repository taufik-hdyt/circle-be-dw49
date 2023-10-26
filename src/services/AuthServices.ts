import { Repository } from "typeorm"
import { User } from "../entity/User"
import { AppDataSource } from "../data-source"
import { Request, Response } from "express"
import { createUserSchema } from "../utils/validator/User"
import * as bcrypt from 'bcrypt'
import  * as jwt from "jsonwebtoken"

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
      const {fullname,email,password} = req.body;
         // CHECK EMAIL
         const checkEmail = await this.UserRepository.findOne({
          where: {
            email,
          },
        });

        if (checkEmail) {
          throw new Error ("Email sudah terdaftar")
        }

        const passwordHashed = await bcrypt.hash(password,10)

      // cek validate input body
      const { error } = createUserSchema.validate(req.body);
      if (error) return res.status(401).json({ Error: error });

      const user = this.UserRepository.create({
        username: `user${Math.floor(Math.random() * 10)}`,
        fullname: fullname,
        email: email,
        password: passwordHashed,
        profile_picture: "https://www.nicepng.com/png/full/933-9332131_profile-picture-default-png.png",
        profile_description: "",
      });

      const createdUser = await this.UserRepository.save(user)
      return res.status(201).json({
        data: createdUser,
        message: "Success Create User"
      })
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        Error: "Error Create User",
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

  async login(req:Request, res:Response): Promise<Response>{
    try {
      const {emailOrUsername,password} = req.body

      //  Check Email / User
      const userSelected = await this.UserRepository.findOne({
        where: [  {email: emailOrUsername},
          {username: emailOrUsername}]


      })
      if(!userSelected) return res.status(400).json({
        message: "Email or Username wrong"
      })

      // Check Login
      const isPasswordValid = await bcrypt.compare(password,userSelected.password)
      if(!isPasswordValid) return res.json({
        message: "Password Wrong"
      })

      // create token
      const token = jwt.sign({
        id: userSelected.id
      }, "eojewfidvdsjvkvchcvcxv", {expiresIn: 500000})

      return res.status(201).json({
        code: 201,
        status: "success",
        message: "Login Success",
        token,
      });

    } catch (error) {
      console.log(error);

    }
  }


}