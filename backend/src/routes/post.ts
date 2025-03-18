import express, { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post";
import multer from "multer";
import mongoose from "mongoose";

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints for managing posts
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               userId:
 *                 type: string
 *               username:
 *                 type: string
 *               avatar:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Missing required fields
 */
// ✅ Create a new post
router.post(
  "/",
  upload.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("📩 Received post request:", req.body); // ✅ Log request data for debugging

      const { content, userId, username, avatar } = req.body;
      if (!content || !userId || !username) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      // ✅ Ensure userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
      }

      // ✅ Update the image path to be accessible via backend URL
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

      const post = new Post({
        user: new mongoose.Types.ObjectId(userId),
        username,
        avatar,
        content,
        image: imagePath, // ✅ Ensure correct image path
      });

      await post.save();
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/posts/like/{postId}:
 *   put:
 *     summary: Like/unlike a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to like/unlike
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user liking/unliking the post
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: User ID is required
 *       404:
 *         description: Post not found
 */
// ✅ Like/unlike a post
router.put(
  "/like/:postId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const post = await Post.findById(req.params.postId);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      const likeIndex = post.likes.indexOf(userId);
      if (likeIndex !== -1) {
        post.likes.splice(likeIndex, 1);
      } else {
        post.likes.push(userId);
      }

      await post.save();
      res.json(post);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/posts/comment/{postId}:
 *   post:
 *     summary: Comment on a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               username:
 *                 type: string
 *               avatar:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Post not found
 */
// ✅ Comment on a post
router.post(
  "/comment/:postId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, username, avatar, text } = req.body;
      if (!userId || !username || !text) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const post = await Post.findById(req.params.postId);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      const comment = {
        user: userId,
        username,
        avatar,
        text,
        createdAt: new Date(),
      };

      post.comments.push(comment);
      await post.save();
      res.json(post);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Fetch all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 *       404:
 *         description: No posts found
 */
// ✅ Fetch all posts
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("📥 Received request to fetch all posts"); // ✅ Log request data for debugging
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/posts/user/{userId}:
 *   get:
 *     summary: Fetch posts by a specific user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to fetch posts for
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 *       404:
 *         description: No posts found for the user
 */
// ✅ Fetch posts by a specific user
router.get(
  "/user/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("📥 Received request to fetch user posts"); // ✅ Log request data for debugging
    try {
      const posts = await Post.find({ user: req.params.userId }).sort({
        createdAt: -1,
      });
      res.json(posts);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 */
// ✅ Update a post
router.put(
  "/:postId",
  upload.single("image"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      const { content } = req.body;
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

      post.content = content;
      post.image = imagePath || post.image;
      await post.save();
      res.json(post);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
// ✅ Delete a post
router.delete(
  "/:postId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      await post.deleteOne();
      res.json({ message: "Post deleted" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
