"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_1 = require("../controllers/post"); // ודא שהפונקציות האלה מיובאות כראוי
const router = (0, express_1.Router)();
// יצירת פוסט חדש
router.post("/", post_1.createPost);
// קבלת כל הפוסטים
router.get("/", post_1.getAllPosts);
// קבלת פוסט לפי ID
router.get("/:id", post_1.getPostById);
// מחיקת פוסט לפי ID
router.delete("/:id", post_1.deletePost);
exports.default = router; // ייצוא נכון של ה-router
