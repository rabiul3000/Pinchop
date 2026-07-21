import { fixedWindow } from "@arcjet/node";
import aj from "../config/arcjetConnect.js";

const arcjetMiddle = async (req, res, next) => {
  try {
    const customRules = [];

    // Additional strict rate limit for file uploads
    if (req.method === "POST" && req.path === "/create") {
      customRules.push(
        fixedWindow({
          mode: "LIVE",
          window: "10m",
          max: 3,
        })
      );
    }

    const decision = await aj.protect(req, customRules);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          success: false,
          error: "Too many requests. Please try again later.",
        });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({
          success: false,
          error: "Automated requests are not allowed.",
        });
      }

      return res.status(403).json({
        success: false,
        error: "Access denied.",
      });
    }

    return next();
  } catch (error) {
    console.error("Arcjet protection error:", error);

    // Fail open
    return next();
  }
};

export default arcjetMiddle;