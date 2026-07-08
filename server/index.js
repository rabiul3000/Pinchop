import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv"
import morgan from "morgan"
import router from "./routers/router.js";
import mongodbConnect from "./config/mongoDBConnect.js";
import cloudinaryConnect from "./config/cloudinaryConnect.js";

dotenv.config();

export const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors())
app.use(morgan("dev"))
app.use(router)




const startServer = async () => {
    const port = process.env.PORT || 3000;
    await mongodbConnect();
    await cloudinaryConnect()

    app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
};

startServer();

