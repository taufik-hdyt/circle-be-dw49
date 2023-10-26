import { Request, Response } from "express";
import ThreadServices from "../services/ThreadServices";
import ReplyServices from "../services/ReplyServices";

export default new class ThreadControllers{
  add(req: Request, res: Response){
    ReplyServices.add(req,res)
  }
}