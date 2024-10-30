import express from "express";
import cors from "cors";
import pool from "./database";
import dotenv from "dotenv";
import { userRouter } from "./routes/user";
import { authRoutes } from "./routes/auth";
import { posts } from "./routes/post";
import protectedRoute from "./routes/protectedRoute"; // Import the protected route
import * as admin from "firebase-admin";
const serviceAccount = require("./config/serviceAccountKey.json"); // JSON import should work now

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

dotenv.config();
const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's URL in production
    credentials: true, // Allows cookies and credentials
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  }),
);

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Register routes
app.use("/user", userRouter);
app.use("/auth", authRoutes);
app.use("/post", posts);
app.use("/api", protectedRoute); // Use the protected route

const PORT = process.env.PORT || 3001;

pool
  .connect()
  .then((client) => {
    console.log("Connecting to PostgreSQL database");
    client.release();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database", err.stack);
  });
