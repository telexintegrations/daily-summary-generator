import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  channel_id: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", MessageSchema);
