import * as fs from 'fs'

export const deleteFile = (path: string)=> {
  // if file exits
  if(fs.existsSync(path)){
    // delete
    fs.unlinkSync(path)
  }
}