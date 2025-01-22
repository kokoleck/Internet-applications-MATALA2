import { Router } from "express";
import { createPost, getAllPosts, getPostById, deletePost } from "../controllers/post"; // ודא שהפונקציות האלה מיובאות כראוי

const router = Router();

// יצירת פוסט חדש
router.post("/", createPost);

// קבלת כל הפוסטים
router.get("/", getAllPosts);

// קבלת פוסט לפי ID
router.get("/:id", getPostById);

// מחיקת פוסט לפי ID
router.delete("/:id", deletePost);

export default router; // ייצוא נכון של ה-router
