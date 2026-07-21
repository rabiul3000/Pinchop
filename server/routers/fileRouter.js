import express from "express";
import createFile from "../controllers/createFile.js";
import getFileByPin from "../controllers/getFileByPin.js";
import deleteFileByPin from "../controllers/deleteFileByPin.js";
import multerMiddle from "../middlewares/multerMiddle.js";
import arcjetMiddle from "../middlewares/arcjetMiddle.js";

const fileRouter = express.Router();

fileRouter.use(arcjetMiddle);

// Upload route with Multer handling single file 'file'
fileRouter.post("/create", multerMiddle('file'), createFile);

// Lookup and Delete routes using URL params
fileRouter.get("/:pin", getFileByPin);
fileRouter.delete("/:pin", deleteFileByPin);

export default fileRouter;