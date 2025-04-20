import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173", "https://yourfrontenddomain.com"],
                credentials: true }));
app.use(cookieParser());

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret";

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

app.post("/api/users", async (req, res) => {
    const { name, email, goals } = req.body;
    try {
        const user = new User({ name, email, goals });
        await user.save();
        res.status(201).json({ message: "User saved" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save user" });
    }
});

// Register (create hashed password)
app.post("/api/register", async (req, res) => {
    const { name, email, password, goals } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, goals });
      await user.save();
      res.status(201).json({ message: "User registered" });
    } catch (err) {
      res.status(400).json({ error: "Registration failed" });
    }
  });
  
  // Login
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
  
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true, sameSite: "Strict" });
      res.json({ message: "Logged in successfully", user });
    } catch {
      res.status(500).json({ error: "Login error" });
    }
  });

app.listen(5000, () => console.log("Server running on port 5000"));