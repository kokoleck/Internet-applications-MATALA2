import { Request, Response } from "express";
import Post from "../models/posts_model";

// יצירת פוסט חדש
export const createPost = async (req: Request, res: Response): Promise<void> => {
    const { title, content } = req.body;
    const userId = req.user?.userId; // חיבור למידע המשתמש (הJWT), חשוב לבדוק אם יש את המידע

    if (!userId) {
        res.status(400).json({ message: "User not authenticated" });
        return;
    }

    try {
        const newPost = new Post({
            title,
            content,
            senderId: userId,  // הוספת מזהה המשתמש
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (err: any) {
        res.status(400).json({ message: (err as Error).message });
    }
};

// קבלת כל הפוסטים
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    const ownerFilter = req.query.owner as string;
    try {
        let posts;
        if (ownerFilter) {
            posts = await Post.find({ owner: ownerFilter });
        } else {
            posts = await Post.find();
        }
        res.status(200).send(posts);
    } catch (err: any) {
        res.status(400).send({ message: (err as Error).message });
    }
};

// קבלת פוסט לפי ID
export const getPostById = async (req: Request, res: Response): Promise<void> => {
    const postId = req.params.id;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json(post);
    } catch (err: any) {
        res.status(400).send({ message: (err as Error).message });
    }
};

// מחיקת פוסט
export const deletePost = async (req: Request, res: Response): Promise<void> => {
    const postId = req.params.id;
    try {
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            res.status(404).send("Post not found");
            return;
        }
        res.status(200).send({ message: "Post deleted successfully", deletedPost });
    } catch (err: any) {
        res.status(400).send({ message: (err as Error).message });
    }
};
export function getAll(arg0: string, getAll: any) {
    throw new Error('Function not implemented.');
}

export function create(arg0: string, authMiddleware: any, create: any) {
    throw new Error('Function not implemented.');
}

export function getById(arg0: string, getById: any) {
    throw new Error('Function not implemented.');
}

