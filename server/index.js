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

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.use(async (req, res, next) => {
    try {
        await mongodbConnect();
        await cloudinaryConnect();
        next();
    } catch (err) {
        console.error("Database or Cloudinary connection failed:", err);
        res.status(500).json({ success: false, message: "Database connection failed" });
    }
});

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is up and running!" });
});

app.use(router);

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}

export default app;