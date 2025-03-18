import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import axios from "axios";

// Swagger UI endpoint

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // ✅ Required for parsing JSON requests
app.use(express.urlencoded({ extended: true })); // ✅ Required for handling form data

// ✅ Serve uploaded images as static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGO_URI as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ChatGPT Integration Endpoint
app.post("/api/chatgpt", async (req: Request, res: Response): Promise<void> => {
  const { question } = req.body;
  if (!question) {
    res.status(400).json({ error: "Question is required." });
    return;
  }

  try {
    // שליחת בקשה ל-OpenAI API עם המודל "gpt-4o-mini" (המודל הזול ביותר לפי התמחור)
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an assistant that provides recipe suggestions.",
          },
          { role: "user", content: question },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("ChatGPT Error:", error.response?.data || error.message);
      res
        .status(500)
        .json({ error: "An error occurred while fetching answer." });
    } else {
      console.error("ChatGPT Error:", error);
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
});

app.get("/", (req, res) => {
  res.send("🚀 Server is running with TypeScript!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
