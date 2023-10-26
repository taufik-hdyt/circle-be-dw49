import * as jwt  from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";


export function jwtAuth(req:Request, res: Response, next: NextFunction){
  try {
    const authorizationHeader = req.headers.authorization
    if(!authorizationHeader || !authorizationHeader.startsWith("Bearer")){
      throw new Error()
    }
    const token = authorizationHeader.split(" ")[1]
    const auth = jwt.verify(token,"eojewfidvdsjvkvchcvcxv")
    res.locals.auth = auth
    next()
  } catch (error) {
    console.log(error);

    res.status(400).json(error)
  }
}