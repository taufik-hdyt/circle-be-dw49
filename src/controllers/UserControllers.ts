import { Request, Response } from "express";
import AuthServices from "../services/AuthServices";
import UserServices from "../services/UserServices";

export default new class UserControllers{
  login(req: Request, res: Response){
    AuthServices.login(req,res)
  }
  register(req: Request, res: Response){
    AuthServices.register(req,res)
  }
  authCheck(req: Request, res: Response){
    AuthServices.check(req,res)
  }

  findOne(req: Request, res: Response){
    UserServices.findOne(req,res)
  }

  find(req: Request, res: Response){
    UserServices.find(req,res)
  }

  update(req: Request, res: Response){
    UserServices.update(req,res)
  }

  suggest(req: Request, res: Response){
    UserServices.suggestUser(req,res)
  }
  delete(req: Request, res: Response){
    UserServices.delete(req,res)
  }
}