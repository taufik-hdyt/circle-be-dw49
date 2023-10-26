import { Request, Response } from "express";
import LikeSevices from "../services/LikeSevices";

export default new class UserControllers{
  Like(req: Request, res: Response){
    LikeSevices.Like(req,res)
  }
}