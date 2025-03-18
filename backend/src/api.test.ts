/// <reference types="jest" />

// api.test.ts
import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import postsRouter from "./routes/post"; // עדכנו את הנתיב לפי הפרויקט שלכם
import usersRouter from "./routes/auth"; // עדכנו את הנתיב לפי הפרויקט שלכם

// הקמת Express App לצורך הבדיקות
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// הרכבת הנתיבים
app.use("/api/posts", postsRouter);
app.use("/api/auth", usersRouter);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // יצירת מסד נתונים בזיכרון לצורך הבדיקות
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Users API", () => {
  let userId: string;
  let refreshToken: string;
  let accessToken: string;

  test("Register - POST /api/auth/register", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      username: "testuser",
      password: "TestPassword123",
    });
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty("_id");
    userId = res.body.user._id;
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  test("Login - POST /api/auth/login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "TestPassword123",
    });
    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("_id");
  });

  test("Refresh Token - POST /api/auth/refresh", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  test("Logout - POST /api/auth/logout", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");
  });

  test("Update Profile - PUT /api/auth/update-profile/:userId", async () => {
    const res = await request(app)
      .put(`/api/auth/update-profile/${userId}`)
      // שימוש ב-field עבור multipart/form-data (ללא העלאת קובץ)
      .field("username", "updateduser")
      .field("email", "updated@example.com");
    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe("updateduser");
  });
});

describe("Posts API", () => {
  let postId: string;
  // ניצור מזהה משתמש תקין לצורך בדיקות פוסטים (ניתן להשתמש גם במשתמש מה-Users API)
  const testUserId = new mongoose.Types.ObjectId().toHexString();

  test("Create Post - POST /api/posts", async () => {
    const res = await request(app)
      .post("/api/posts")
      .field("content", "This is a test post")
      .field("userId", testUserId)
      .field("username", "postuser")
      .field("avatar", "avatar.png")
      .attach("image", Buffer.from("dummy image content"), "test.jpg");
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    postId = res.body._id;
  });

  test("Like Post - PUT /api/posts/like/:postId (like)", async () => {
    const res = await request(app)
      .put(`/api/posts/like/${postId}`)
      .send({ userId: testUserId });
    expect(res.status).toBe(200);
    // בהנחה שהמערך היה ריק, כעת המשתמש נוסף לרשימת הלייקים
    expect(res.body.likes).toContain(testUserId);
  });

  test("Unlike Post - PUT /api/posts/like/:postId (unlike)", async () => {
    // לחיצה חוזרת תסיר את הלייק
    const res = await request(app)
      .put(`/api/posts/like/${postId}`)
      .send({ userId: testUserId });
    expect(res.status).toBe(200);
    expect(res.body.likes).not.toContain(testUserId);
  });

  test("Comment on Post - POST /api/posts/comment/:postId", async () => {
    const res = await request(app).post(`/api/posts/comment/${postId}`).send({
      userId: testUserId,
      username: "commenter",
      avatar: "avatar.png",
      text: "This is a comment",
    });
    expect(res.status).toBe(200);
    expect(res.body.comments.length).toBeGreaterThan(0);
  });

  test("Fetch All Posts - GET /api/posts", async () => {
    const res = await request(app).get("/api/posts");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Fetch Posts by User - GET /api/posts/user/:userId", async () => {
    const res = await request(app).get(`/api/posts/user/${testUserId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Update Post - PUT /api/posts/:postId", async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .field("content", "Updated post content")
      .attach("image", Buffer.from("new dummy image content"), "newtest.jpg");
    expect(res.status).toBe(200);
    expect(res.body.content).toBe("Updated post content");
  });

  test("Delete Post - DELETE /api/posts/:postId", async () => {
    const res = await request(app).delete(`/api/posts/${postId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Post deleted");
  });
});
