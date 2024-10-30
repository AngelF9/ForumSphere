import { Router, Request, Response, NextFunction } from "express";
import pool from "../database";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
  try {
    const { user_id, content, image_url, visibility } = req.body;

    const result = await pool.query(
      `INSERT INTO post (user_id, content, image_url, visibility) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, content, image_url, visibility],
    );

    res.status(201).json(result.row[0]);
  } catch (error) {
    console.error("Error posting: ", error);
  }
});

router.post("/user/:user_id", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM post WHERE user_id = $1 AND (visibility = 'public' OR user_id = $1)`,
      [userId],
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

router.post("/my-post/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const result = await pool.query(
      `SELECT * FROM post WHERE user_id = $1 ORDER BY created_at DESC;`,
      [userId],
    );
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: "No posts found for this user." });
    }
  } catch (error) {
    console.error("Error finding post: ", error);
  }
});

export { router as posts };
