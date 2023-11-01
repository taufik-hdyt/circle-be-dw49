import {v2 as cloudinary} from 'cloudinary'

export const uploadToCloudinary = (file: Express.Multer.File):Promise<string | undefined> => {
  cloudinary.config({
    cloud_name: "doushe6hn",
    api_key: '866624875478827',
    api_secret: "-iE68VPffoTGtfUUS1ItgtDRI_0"
  })

  return new Promise((resolve,reject)=> {
    const opt = {folder: "circle-apps"}
    cloudinary.uploader.upload(file.path, opt, function(err,res){
      if(err){
        return reject(err)
      }
      return resolve(res?.secure_url)
    })
  })
}