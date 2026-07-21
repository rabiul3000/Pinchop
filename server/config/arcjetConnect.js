import arcjet, { detectBot, fixedWindow, shield } from "@arcjet/node";
import dotenv from "dotenv";

dotenv.config();

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),

    // Explicitly deny automated bots & scrapers
    detectBot({
      mode: "LIVE",
      deny: ["CATEGORY:BOT"],
    }),

    // General rate limit applied whenever arcjetMiddle is hit
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 15,
    }),
  ],
});

export default aj;