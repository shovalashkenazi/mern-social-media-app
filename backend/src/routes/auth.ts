import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";
import multer from "multer";
import path from "path";
import admin from "firebase-admin";

dotenv.config();
const router = express.Router();

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      // Replace literal "\n" with actual newlines in the private key string.
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user authentication and profile management
 */

// ✅ Configure Multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profiles"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage }); // ✅ Define `upload` here before using it

const generateAccessToken = (user: any): string => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user: any): string => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
};

// ✅ User Registration
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: User Registration
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: All fields are required or Email already in use
 */
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "Email already in use" });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, username, password: hashedPassword });

      await user.save();

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.status(201).json({ user, accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  }
);

// ✅ User Login
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User Login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid email or password
 */
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });

      if (!user || !user.password) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid email or password" });
        return;
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.json({ user, accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  }
);

// ✅ Refresh Token
/**
 * @swagger
 * /api/users/refresh:
 *   post:
 *     summary: Refresh Access Token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *       403:
 *         description: Refresh token required or Invalid refresh token
 */
router.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token required" });
      return;
    }

    try {
      const decoded: any = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      );
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(403).json({ message: "Invalid refresh token" });
        return;
      }

      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken });
    } catch {
      res.status(403).json({ message: "Invalid refresh token" });
    }
  }
);

// ✅ Logout (Clear Tokens)
/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: User Logout
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", (req: Request, res: Response) => {
  res.status(200).json({ message: "Logged out successfully" });
});

/* @swagger
 * /api/users/google:
 *   post:
 *     summary: OAuth Login with Google
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully with Google OAuth
 *       400:
 *         description: Invalid token or error during authentication
 */
router.post(
  "/google",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;
      if (!token) {
        res.status(400).json({ message: "Token is required" });
        return;
      }
      // Verify the ID token using Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);
      const email = decodedToken.email;
      if (!email) {
        res.status(400).json({ message: "Email not found in token" });
        return;
      }
      // Check if user exists; if not, create a new user with authProvider set to 'google'
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          email,
          username: decodedToken.name || email.split("@")[0],
          authProvider: "google",
        });
        await user.save();
      }
      // Generate JWT tokens for the user
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      res.json({ user, accessToken, refreshToken });
    } catch (error) {
      console.error("Error in Google OAuth:", error);
      res.status(400).json({ message: "Invalid token", error });
    }
  }
);

// ✅ Update User Profile
/**
 * @swagger
 * /api/users/update-profile/{userId}:
 *   put:
 *     summary: Update User Profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Username already in use or validation error
 *       404:
 *         description: User not found
 */
router.put(
  "/update-profile/:userId",
  upload.single("profileImage"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const { username, email } = req.body;

      // ✅ Ensure username is unique
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        res.status(400).json({ message: "Username already in use" });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      user.username = username || user.username;
      user.email = email || user.email;
      if (req.file) {
        user.profileImage = `/uploads/profiles/${req.file.filename}`;
      }

      await user.save();

      res.json({ message: "Profile updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export default router;
