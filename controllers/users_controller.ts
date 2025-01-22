// users_controller.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user_model";  // ודא שאתה מייבא את המודל נכון

// יצירת משתמש חדש
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

// התחברות של משתמש
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
    }

    const isMatch = await user.comparePassword(password);  // קריאה למתודה comparePassword במודל
    if (!isMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
    }

    res.status(200).json({ message: "Login successful" });
};
