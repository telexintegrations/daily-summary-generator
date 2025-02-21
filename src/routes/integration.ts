import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/integration.json", (req: Request, res: Response) => {
  const baseUrl = process.env.BASE_URL;

  res.json({
    data: {
      date: {
        created_at: "2025-02-08",
        updated_at: "2025-02-15"
      },
      descriptions: {
        app_name: "Daily Summary Generator",
        app_description: "Summarizes channel messages every 24 hours.",
        app_logo: "https://res.cloudinary.com/digjbgzof/image/upload/v1739624354/joih6vrkknve5eifwj9y.webp",
        app_url: baseUrl,
        background_color: "#0000ff"
      },
      is_active: true,
      integration_type: "interval",
      integration_category: "Monitoring & Logging",
      key_features: [
        "Summarizes all messages every 24 hours",
        "Uses GPT-4 to generate summaries",
        "Automatically posts summaries to the channel"
      ],
      author: "Alexin",
      settings: [
        {
          label: "interval",
          type: "text",
          required: true,
          default: "0 8 * * *"
        },
        {
          label: "openai_api_key",
          type: "text",
          required: true,
          secure: true
        }
        // {
        //   label: "summary_length",
        //   type: "dropdown",
        //   required: true,
        //   default: "short",
        //   options: ["short", "detailed"]
        // },
        // {
        //   label: "language",
        //   type: "dropdown",
        //   required: false,
        //   default: "English",
        //   options: ["English", "French", "Spanish
      ],      
      target_url: `${baseUrl}/target`,
      tick_url: `${baseUrl}/tick`
    }
  });
});

export default router;
