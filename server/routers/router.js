import express from "express"
import fileRouter from "./fileRouter.js";



const router = express.Router();



router.use("/file", fileRouter)


router.get("/", (req, res) => res.status(200).json("this is the home router"))






export default router;