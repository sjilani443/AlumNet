import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import eventRoutes from "./routes/eventRoutes.js"; // Ensure file extension `.js` is included
import authRoutes from "./routes/authRoutes.js"; 
import connectionRoutes from "./routes/connectionRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import profile from "./routes/profile.js"
import alumniRoutes from "./routes/alumniRoutes.js"

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173', // React app's origin
    credentials: true, // Allow credentials (cookies, tokens)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/connections",connectionRoutes);
app.use("/api/profile",profile);
app.use('/api/alumni', alumniRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
