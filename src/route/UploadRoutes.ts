import { Router } from "express";
import uploadImages from "../middlewares/UploadImages";
import imageUploadController from "../controllers/FileUploadControllers";

const UploadRoutes = Router();

// POST | /upload
UploadRoutes.post(
  "/upload",
  uploadImages.single("image"),
  imageUploadController.uploadImage
);

export default UploadRoutes;
