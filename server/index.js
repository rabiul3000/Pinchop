import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import router from "./routers/router.js";
import mongodbConnect from "./config/mongoDBConnect.js";
import cloudinaryConnect from "./config/cloudinaryConnect.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(router);



const runServer = async () => {
    let port = process.env.PORT || 3000
    try {
        await mongodbConnect();
        await cloudinaryConnect();

        app.listen(port, () => console.log(`server is running on http://localhost:${port}`))

    } catch (err) {
        console.error("Database or Cloudinary connection failed:", err);
    }

}


runServer()