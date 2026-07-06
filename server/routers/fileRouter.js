import express from "express"
import createFile from "../controllers/createFile.js";
import multerMiddleware from "../middlewares/multerMiddleWare.js";

const fileRouter = express.Router()



fileRouter.post("/create", multerMiddleware('file'), createFile)



export default fileRouter;