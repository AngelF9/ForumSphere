import express from "express";
import * as admin from "firebase-admin";

const router = express.Router();

// Protected route that requires Firebase authentication
router.post("/protected-route", async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ error: "No token provided" });
    }
    const idToken = authHeader.split("Bearer ")[1];

    // Verify the ID token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid; // UID of the authenticated user

    console.log("Authenticated UID:", uid);

    res.status(200).send({ message: "User authenticated successfully", uid });
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(401).send({ error: "Invalid ID token" });
  }
});

export default router;
