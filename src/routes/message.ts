import express, { Request, Response, Router } from "express";
import Message from "../models/Message";

const router: Router = express.Router();

router.post("/target", async (req: Request, res: Response) => {
  console.log('Target request received: ', req.body)
  const { channel_id, message } = req.body;
  if (!channel_id || !message) {
    return res.status(400).json({ error: "Invalid payload" });
  }
 
  try {
    await Message.create({ channel_id, message });
    res.sendStatus(202);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Failed to store message" });
  }
});

export default router;
