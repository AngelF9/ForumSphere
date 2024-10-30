import { Router, Request, Response, NextFunction } from "express";
import pool from "../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserErrors } from "./errors";

// create a new router object
const router = Router();
// first router request
// when someone makes a request to localhost:3001/register
// whatever code we write here should satisfy that request
router.post("/register", async (req: Request, res: Response) => {
  try {
    // username and password are recieved from request body
    const { username, password } = req.body;
    // check if user exist
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (user.rows.length > 0) {
      // user does exist so return
      return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
    }

    // creating hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    // insert new user into the database
    await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, hashedPassword],
    );
    res.json({ message: "User registered successfully" });
  } catch (err) {
    // return back with a status of 500: server error
    res.status(500).json({ type: err });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  // username and password are recieved from request body
  const { username, password } = req.body;
  try {
    // find the user in the database
    const userResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );
    const user = userResult.rows[0];
    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }
    // -- Compare provided password with stored hashed password --
    // decryption & comparisson of hashed password and cur_pw
    // bcrypt comparison is asynchronous and should be awaited
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
    }

    // -- Generate a JWT token --
    // we can now begin the creation of user
    // we created an encrypted version of object
    // object conatins unique identifier for the user
    // so the encrypted version of this unique id will be our token
    const token = jwt.sign({ id: user._id }, "secret");

    // -- Send the token and useID back to the client --
    res.json({ token, userID: user.id });
  } catch (err) {
    res.status(500).json({ type: err });
  }
});

// check if the authicated user is making the request
// for example when buying an item.
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, "secret", (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};

// would like to import route within the index.ts file
// so simplity export...
export { router as userRouter };
