import express from "express"
import multer from "multer"
import { saveUsersPictures } from "../../lib/fs-tools.js"

const filesRouter = express.Router()

filesRouter.post("/uploadSingle", multer({ limits: { fileSize: 1 * 1024 } }).single("avatar"), async (req, res, next) => {
  // "avatar" does need to match exactly to the property name appended to the FormData object in the frontend, otherwise Multer is not going to be able to find the file in the request body
  try {
    console.log("FILE: ", req.file)
    await saveUsersPictures(req.file.originalname, req.file.buffer)
    res.send()
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/uploadMultiple", multer().array("avatars"), async (req, res, next) => {
  try {
    console.log("FILES: ", req.files)
    const arrayOfPromises = req.files.map(file => saveUsersPictures(file.originalname, file.buffer))
    await Promise.all(arrayOfPromises)
    res.send()
  } catch (error) {
    next(error)
  }
})

export default filesRouter
