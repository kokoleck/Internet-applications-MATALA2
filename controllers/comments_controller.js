const Comment = require("../models/comment");

// Create a new comment
const createComment = async (req, res) => {
    const comment = new Comment({
        postId: req.body.postId,
        content: req.body.content,
        author: req.body.author,
    });

    try {
        const newComment = await comment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all comments
const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get comments by post ID
const getCommentsByPostId = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a comment
const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (req.body.content) comment.content = req.body.content;
        if (req.body.author) comment.author = req.body.author;
        comment.updatedAt = Date.now();

        const updatedComment = await comment.save();
        res.json(updatedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        await comment.deleteOne();
        res.json({ message: "Comment deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createComment,
    getAllComments,
    getCommentsByPostId,
    updateComment,
    deleteComment,
};
