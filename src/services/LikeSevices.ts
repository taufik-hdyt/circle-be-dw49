import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { Like } from "../entity/Likes";
import { Thread } from "../entity/Thread";
import { User } from "../entity/User";

export default new (class ThreadServices {
  private readonly LikeRepository: Repository<Like> =
    AppDataSource.getRepository(Like);
    private readonly ThradRepository: Repository<Thread> =
    AppDataSource.getRepository(Thread);
    private readonly UserRepository: Repository<User> =
    AppDataSource.getRepository(User);

    async Like(req: Request, res: Response): Promise<Response> {
      try {
        const {id} = req.params
        if(!id) return res.status(400).json({
          message: "Id is not valid"
        })

        const userSelected: User | null = await this.UserRepository.findOne({
          where: {
            id : res.locals.auth.id
          }
        })

        if(!userSelected) {
          res.status(404).json({
            message: "User not found"
          })
        }

        const threadSelected: Thread | null = await this.ThradRepository.findOne({
          where: {
            id: parseInt(req.params.id)
          }
        })
        // check like if exits
        const likeSelected: Like | null = await this.LikeRepository.findOne({
          where: {
            user: {
              id: userSelected.id
            },
            thread: {
              id: threadSelected.id
            }
          }
        })
        // if already like
        if (likeSelected) {
          await this.LikeRepository.delete(likeSelected.id);
          return res.status(201).json({
            code: 201,
            status: "success",
            message: "Unlike",
          });
        }

        // if not yel like
        const like = new Like()
        like.user = userSelected
        like.thread = threadSelected
        await this.LikeRepository.save(like)

        return res.status(201).json({
          code: 201,
          status: "success",
          message: "Like",
        });
        //  ketika ada like


      } catch (error) {
        return res.status(500).json({
          message: error.message
        })
      }
    }


})();
