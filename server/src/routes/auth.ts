import { Router, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import pool from "../database";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Sign-In route to verify and create user in the database
router.post("/google", async (req: Request, res: Response) => {
  const { token: idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "Token not provided" });
  }

  try {
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Extract user info from the token payload
    const payload = ticket.getPayload();
    const googleId = payload["sub"];
    const email = payload["email"];
    const name = payload["name"];
    const picture = payload["picture"];

    // Find or create the user in the database
    const user = await findOrCreateUser(googleId, email, name, picture);

    // Generate a custom JWT for session management
    const jwtToken = createJWT(user.id);

    // Send the custom JWT and user info back to the client
    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Helper function to find or create a user in the database
const findOrCreateUser = async (
  googleId: string,
  email: string,
  name: string,
  picture: string,
) => {
  const user = await pool.query("SELECT * FROM users WHERE google_id = $1", [
    googleId,
  ]);

  if (user.rows.length === 0) {
    // Insert new user if not found
    const result = await pool.query(
      "INSERT INTO users (google_id, email, name, profile_pic) VALUES ($1, $2, $3, $4) RETURNING *",
      [googleId, email, name, picture],
    );
    return result.rows[0];
  }

  return user.rows[0]; // Return existing user
};

// Function to create a JWT token for the user
const createJWT = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export { router as authRoutes };
