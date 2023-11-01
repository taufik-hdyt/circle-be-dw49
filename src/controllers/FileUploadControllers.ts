import { Request, Response } from "express";
import UploadServices from "../services/UploadServices";

export default new class imageUploadController{
  uploadImage(req: Request, res: Response){
    UploadServices.uploadCloudinary(req,res)
  }
}