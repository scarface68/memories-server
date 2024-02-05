import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import PostMessage from "./models/postMessage.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const CONNECTION_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5000;

try {
  await mongoose.connect(CONNECTION_URL);
  console.log("Database connected successfully");
} catch (error) {
  console.log("Error while connecting to the database", error);
}

app.get("/", (req, res) => {
  res.send("hello memories api here.");
});

app.get("/posts", async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.post("/posts", async (req, res) => {
  const newPost = req.body;

  const newPostMessage = new PostMessage(newPost);
  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
