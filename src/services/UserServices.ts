import { ILike, Repository } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";


export default new (class UserServices {
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);
  async suggestUser(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.UserRepository.createQueryBuilder()
        .select()
        .orderBy("RANDOM()")
        .limit(3)
        .getMany();
      return res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async find(req: Request, res: Response): Promise<Response> {
    try {
      const {search=""} = req.query
      const user = await this.UserRepository.find({
        where: [
          {fullname: ILike(`%${search}%`)},
          {username: ILike(`%${search}%`)}
        ]
      });
      return res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const user = await this.UserRepository.findOne({
        where: {
          id,
        },

      });
      if (!user) res.status(404).json({ message: " Data Not found" });
      const followings = await this.UserRepository.query(
        "SELECT u.id, u.username, u.fullname, u.profile_picture FROM following as f INNER JOIN users as u ON u.id=f.following_id WHERE f.follower_id=$1",
        [id]
      );
      const followers = await this.UserRepository.query(
        "SELECT u.id, u.username, u.fullname, u.profile_picture FROM following as f INNER JOIN users as u ON u.id=follower_id WHERE f.following_id=$1",
        [id]
      );

      const userDetail = {
        user,
        followers,
        followings,
      };
      return res.status(200).json(userDetail);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const thread = await this.UserRepository.findOne({
        where: {
          id,
        },
      });
      if (!thread)
        return res.status(404).json({
          message: "Data Not Found",
        });

      await this.UserRepository.delete(id);
      res.status(200).json("Deleted");
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const user = await this.UserRepository.findOne({
        where: {
          id,
        },
      });
      user.fullname = data.fullname;
      user.email = data.email;
      user.password = data.password;
      user.profile_picture = data.profile_picture;
      user.profile_description = data.profile_description;
      user.username = data.username;
      const update = await this.UserRepository.save(user);
      return res.status(200).json(update);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
})();
