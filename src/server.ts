import express from "express";
import cors from "cors";
import integrationRoutes from "./routes/integration";
import messageRoutes from "./routes/message";
import summarizeRoutes from "./routes/summarize";
import dotenv from "dotenv";
import { connectDB } from "./config/database";


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/", integrationRoutes);
app.use("/", messageRoutes);
app.use("/", summarizeRoutes);

app.get("/", (req, res) => {
  res.send("Telex Summary Generator is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
