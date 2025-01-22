import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware לאימות JWT
const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as { userId: string }; // שמירת המידע על המשתמש בבקשה
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

export default authenticateJWT;  // ייצוא כ-default
