import { Request, Response } from "express";
import UserServices from "../services/UserServices";

export default new class UserControllers{
  find(req: Request, res: Response){
    UserServices.find(req,res)
  }
  findOne(req: Request, res: Response){
    UserServices.findOne(req,res)
  }

  delete(req: Request, res: Response){
    UserServices.delete(req,res)
  }

  update(req: Request, res: Response){
    UserServices.update(req,res)
  }

  create(req: Request, res: Response){
    UserServices.create(req,res)
  }
}