import express from "express";
import axios from "axios";
import Message from "../models/Message";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/tick", async (req, res) => {
  console.log("Tick request received: ", req.body);
  const { channel_id, return_url, settings } = req.body;

  if (!channel_id || !return_url || !settings) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  // Retrieve the OpenAI API key from settings
  const openaiApiKeySetting = settings.find((s: any) => s.label === "openai_api_key");
  const openaiApiKey = openaiApiKeySetting?.default;

  if (!openaiApiKey) {
    console.error("❌ OpenAI API key is missing.");
    await axios.post(return_url, {
      message: "Error: OpenAI API key is missing or invalid.",
      username: "Daily Summary Bot",
      event_name: "Daily Summary",
      status: "failed",
    }).catch(err => console.error("Failed to send error response to return_url:", err));
    
    return res.status(400).json({ error: "OpenAI API key is missing or invalid." });
  }

  try {
    const messages = await Message.find({
      channel_id,
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (!messages.length) {
      console.log("No messages to summarize for channel:", channel_id);
      await axios.post(return_url, {
        message: "No messages to show.",
        username: "Daily Summary Bot",
        event_name: "Daily Summary",
        status: "success",
      }).catch(err => console.error("Failed to send response to return_url:", err));

      return res.json({ message: "No messages to show." });
    }

    // Format messages for summarization
    const formattedMessages = messages
      .map((m, index) => `🔹 [${new Date(m.timestamp).toLocaleString()}] ${m.message}`)
      .join("\n");

    const prompt = `
      As a Daily Summary Bot, generate a detailed report summarizing the key events from the last 24 hours.
      Organize the summary with sections: "Key Events", "Actions Taken", and "Next Steps".
      Keep it clear and informative, suitable for team review.

      Messages:
      ${formattedMessages}
    `;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "system", content: prompt }],
      },
      {
        headers: { Authorization: `Bearer ${openaiApiKey}` },
      }
    );

    const summary = response.data?.choices?.[0]?.message?.content || "Summary unavailable.";

    await axios.post(return_url, {
      message: summary,
      username: "Daily Summary Bot",
      event_name: "Daily Summary",
      status: "success",
    }).catch(err => console.error("Failed to send response to return_url:", err));

    // Delete messages after summarization
    await Message.deleteMany({ channel_id });

    res.json({ status: "Summary posted successfully" });
  } catch (error) {
    console.error("❌ Summarization error:", error);

    // Send error message back to Telex
    await axios.post(return_url, {
      message: "Error: Failed to generate summary. Please check API key and message format.",
      username: "Daily Summary Bot",
      event_name: "Daily Summary",
      status: "failed",
    }).catch(err => console.error("Failed to send error response to return_url:", err));

    res.status(500).json({ error: "Failed to generate summary." });
  }
});

export default router;
