import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user_model"; // מודל המשתמש

const router = Router();

// רישום משתמש חדש
router.post("/register", async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const newUser = new User({
            username,
            email,
            password, // סיסמה לא מוצפנת, היא תצפין אוטומטית
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error });
    }
});

// התחברות משתמש
router.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        // אימות סיסמה
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        // יצירת JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
            expiresIn: "1h", // תוקף של 1 שעה
        });

        res.status(200).json({ token });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error });
    }
});

// יציאה (Logout)
router.post("/logout", (req: Request, res: Response): void => {
    res.status(200).json({ message: "User logged out" });
});

export default router; // ייצוא ברירת מחדל של ה-router
