import { Router } from "express";
import uploadImages from "../middlewares/UploadImages";
import imageUploadController from "../controllers/FileUploadControllers";
import { jwtAuth } from "../middlewares/jwtAuth";

const UploadRoutes = Router();

// POST | /upload
UploadRoutes.post(
  "/upload",jwtAuth,
  uploadImages.single("image"), 
  imageUploadController.uploadImage
);

export default UploadRoutes;
