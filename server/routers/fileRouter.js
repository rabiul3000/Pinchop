import express from "express"
import createFile from "../controllers/createFile.js";
import multerMiddleware from "../middlewares/multerMiddleWare.js";
import getFileByPin from "../controllers/getFileByPin.js";
import deleteFileByPin from "../controllers/deleteFileByPin.js";

const fileRouter = express.Router()



fileRouter.post("/create", multerMiddleware('file'), createFile)
fileRouter.get("/:pin", getFileByPin)
fileRouter.delete("/:pin", deleteFileByPin)



export default fileRouter;