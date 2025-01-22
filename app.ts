import authenticateJWT from './middlewares/authMiddleware';  

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postsRoutes from "./routes/posts_routes";
import commentsRoutes from "./routes/comments_routes";
import usersRoutes from "./routes/users_routes";  // ייבוא ברירת מחדל

dotenv.config();
// import { authenticateJWT } from "./middlewares/authMiddleware";

const app = express();

// הגדרת ה-Routes של פוסטים ותגובות תחת אימות JWT
app.use("/posts", authenticateJWT, postsRoutes);
app.use("/comments", authenticateJWT, commentsRoutes);
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_CONNECTION!);


// חיבור ה-Middleware של האימות
app.use("/posts", authenticateJWT, postsRoutes);

const db = mongoose.connection;
db.on("error", (err: any) => console.error(err));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/posts", postsRoutes);
app.use("/comments", commentsRoutes);
app.use("/users", usersRoutes); // הוספת המסלול של המשתמשים

app.get("/about", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}).on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use`);
        process.exit(1);
    } else {
        console.error(err);
    }
});

export { app };  // הוסף את זה
