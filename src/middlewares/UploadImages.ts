import * as multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads"); // save images locals
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // name file
  },
});

const uploadImages = multer({ storage: storage });
export default uploadImages;
