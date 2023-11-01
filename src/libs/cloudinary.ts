import { v2 as cloudinary } from "cloudinary";

export default new (class CloudinaryConfig {
  upload() {
    cloudinary.config({
      cloud_name: "doushe6hn",
      api_key: "866624875478827",
      api_secret: "-iE68VPffoTGtfUUS1ItgtDRI_0",
    });
  }
  async destination(image: any) {
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        "src/uploads/" + image
      );
      return cloudinaryResponse.secure_url
    } catch (error) {
      throw error;
    }
  }
})();
