import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { User } from "../entity/User";

export default new (class ThreadServices {
  private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async Follow(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);

      if (!id)
        return res.status(400).json({
          message: "Id is not valid",
        });
      const followingUser: User | null = await this.UserRepository.findOne({
        where: {
          id,
        },
      });
      if (!followingUser)
        return res.status(404).json({ Error: "User not found" });
      const followerUser: User | null = await this.UserRepository.findOne({
        where: {
          id: res.locals.auth.id,
        },
      });
      if (!followerUser)
        return res.status(404).json({ Error: "User not found" });
      if (followerUser.id === followingUser.id)
        return res.status(401).json({
          message: "Tidak dapat follow sendiri",
        });
      // check jika sudah follow
      const checkFollow = await this.UserRepository.query(
        "SELECT * FROM following WHERE following_id=$1 AND follower_id=$2",
        [followingUser.id, followerUser.id]
      );

      if (checkFollow.length) {
        await this.UserRepository.query(
          "DELETE FROM following WHERE following_id=$1 AND follower_id=$2",
          [followingUser.id, followerUser.id]
        );
        return res.status(200).json({
          status: "success",
          message: "Undo Follow User Success",
        });
      }

      await this.UserRepository.query(
        "INSERT INTO following(following_id,follower_id) VALUES($1,$2)",
        [followingUser.id, followerUser.id]
      )

      return res.status(201).json({
        status: "success",
        message: "Follow Success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        Error: "Error while follow",
      });
    }
  }
})();
