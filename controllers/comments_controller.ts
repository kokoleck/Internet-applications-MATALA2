import { Request, Response } from "express";
import Comment from "../models/comment";

// Create a new comment
export const createComment = async (req: Request, res: Response): Promise<void> => {
    const comment = new Comment({
        postId: req.body.postId,
        content: req.body.content,
        author: req.body.author,
    });

    try {
        const newComment = await comment.save();
        res.status(201).json(newComment);
    } catch (err: any) {
        res.status(400).json({ message: (err as Error).message });
    }
};

// Get all comments
export const getAllComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err: any) {
        res.status(500).json({ message: (err as Error).message });
    }
};

// Get comments by post ID
export const getCommentsByPostId = async (req: Request, res: Response): Promise<void> => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        res.json(comments);
    } catch (err: any) {
        res.status(500).json({ message: (err as Error).message });
    }
};

// Update a comment
export const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }

        if (req.body.content) comment.content = req.body.content;
        if (req.body.author) comment.author = req.body.author;
        comment.updatedAt = new Date();

        const updatedComment = await comment.save();
        res.json(updatedComment);
    } catch (err: any) {
        res.status(400).json({ message: (err as Error).message });
    }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }

        await comment.deleteOne();
        res.json({ message: "Comment deleted" });
    } catch (err: any) {
        res.status(500).json({ message: (err as Error).message });
    }
};
