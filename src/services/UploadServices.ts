import { Request, Response } from "express";
import { uploadToCloudinary } from "../utils/cloudinary/cloudinary";
import { deleteFile } from "../utils/file/fileHelper";

export default new (class UploadServices {
  async uploadCloudinary(req: Request, res: Response): Promise<Response> {
    try {
      let image: string | undefined = undefined;

      if (req.file?.filename) {
        image = await uploadToCloudinary(req.file);
        deleteFile(req.file.path);
      }

      return res.status(200).json({
        status: "Success",
        message: "Upload image success",
        url: image,
      });
    } catch (error) {
      console.log(error);
    }
  }
})();
