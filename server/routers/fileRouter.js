import express from "express"
import createFile from "../controllers/createFile.js";
import getFileByPin from "../controllers/getFileByPin.js";
import deleteFileByPin from "../controllers/deleteFileByPin.js";
import multerMiddleWare from "../middlewares/multerMiddleWare.js";

const fileRouter = express.Router()



fileRouter.post("/create", multerMiddleWare('file'), createFile)
fileRouter.get("/:pin", getFileByPin)
fileRouter.delete("/:pin", deleteFileByPin)



export default fileRouter;