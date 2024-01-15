import { Repository } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { createUserSchema } from "../utils/validator/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export default new (class AuthServices {
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);
    
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { fullname, email, password } = req.body;
      // CHECK EMAIL
      const checkEmail = await this.UserRepository.findOne({
        where: {
          email,
        },
      });
      const checkUsername = await this.UserRepository.findOne({
        where: {
          username: email,
        },
      });

      if(checkUsername)  return res.status(400).json({
        message: "Username is already",
      });

      if (checkEmail)
        return res.status(400).json({
          message: "Email is already",
        });

      const passwordHashed = await bcrypt.hash(password, 10);

      // cek validate input body
      const { error } = createUserSchema.validate(req.body);
      if (error)
        return res.status(401).json({ message: error.details[0].message });

      const user = this.UserRepository.create({
        username: `User${Math.floor(Math.random() * 1000)}`,
        fullname: fullname,
        email: email,
        password: passwordHashed,
        profile_picture:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        profile_description: "",
      });

      const createdUser = await this.UserRepository.save(user);
      return res.status(201).json({
        data: createdUser,
        message: "Success Create User",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { emailOrUsername, password } = req.body;
      //  Check Email / User
      const userSelected = await this.UserRepository.findOne({
        where: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });
      if(!emailOrUsername) return  res.status(400).json({
        message: "Enter  email or password",
      });
      if (!userSelected)
        return res.status(404).json({
          message: "Email or Username not found",
        });
      // Check Login
      const isPasswordValid = await bcrypt.compare(
        password,
        userSelected.password
      );
      if(!password) return  res.status(400).json({
        message: "Enter password",
      });
      if (!isPasswordValid)
        return res.status(404).json({
          message: "Password Wrong",
        });

      // create token
      const token = jwt.sign(
        {
          id: userSelected.id,
        },
        "eojewfidvdsjvkvchcvcxv",
        { expiresIn: 500000 }
      );

      return res.status(201).json({
        code: 201,
        status: "success",
        message: "Login Success",
        token,
      });
    } catch (error) {
      return res.status(500).json({
        message: error,
      });
    }
  }

  async check(req: Request, res: Response): Promise<Response> {
    try {
      const logginSession = res.locals.auth;

      const user = await this.UserRepository.findOne({
        where: {
          id: logginSession.id,
        },
      });

      if (!user)
        return res.status(404).json({
          message: "User not found",
        });

        const followings = await this.UserRepository.query(
          "SELECT u.id, u.username, u.fullname, u.profile_picture FROM following as f INNER JOIN users as u ON u.id=f.following_id WHERE f.follower_id=$1",
          [logginSession.id]
        );
        const followers = await this.UserRepository.query(
          "SELECT u.id, u.username, u.fullname, u.profile_picture FROM following as f INNER JOIN users as u ON u.id=follower_id WHERE f.following_id=$1",
          [logginSession.id]
        );

      return res.status(200).json({
        user,
        message: "You are logged in",
        followers,
        followings,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
})();
