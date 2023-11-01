import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

// versi class
// export default new class AuthenticationMidlewares{
//   Authentication(req: Request,res: Response,next: NextFunction){
//     try {
//       const authorizationHeader = req.headers.authorization
//     if(!authorizationHeader || !authorizationHeader.startsWith("Bearer")){
//       throw new Error()
//     }
//     const token = authorizationHeader.split(" ")[1]
//     // kode generate kunci screet untuk di authService login
//     const auth = jwt.verify(token,"eojewfidvdsjvkvchcvcxv")
//     res.locals.auth = auth

//     // ketika ini berjalan sesuai expetasi maka akan melanjutkan ke fungstion utama poda routes nya
//     next()
//     } catch (error) {
//       console.log(error);
//       res.status(400).json(error)
//     }
//   }
// }

export function jwtAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
      throw new Error();
    }
    const token = authorizationHeader.split(" ")[1];
    // kode generate kunci screet untuk di authService login
    const auth = jwt.verify(token, "eojewfidvdsjvkvchcvcxv");
    res.locals.auth = auth;
    // ketika ini berjalan sesuai expetasi maka akan melanjutkan ke fungstion utama poda routes nya
    next();
  } catch (error) {
    console.log(error);
  }
}
