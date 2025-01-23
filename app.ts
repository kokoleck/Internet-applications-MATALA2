import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postsRoutes from "./routes/posts_routes";
import commentsRoutes from "./routes/comments_routes";
import usersRoutes from "./routes/users_routes";
import authenticateJWT from "./middlewares/authMiddleware";

dotenv.config();

const app = express();

// הגדרת ה-Routes של פוסטים ותגובות תחת אימות JWT
app.use("/posts", authenticateJWT, postsRoutes);
app.use("/comments", authenticateJWT, commentsRoutes);

// חיבור למסד נתונים
mongoose.connect(process.env.DB_CONNECTION!);

const port = process.env.PORT || 3000;

// חיבור ה-Middleware של האימות
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRoutes); // הוספת המסלול של המשתמשים

// המסלול של about
app.get("/about", (req, res) => {
    res.send("Hello World!");
});

// פונקציה שמתחילה את השרת
export const startServer = () => {
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
};

export { app };
