"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getCommentsByPostId = exports.getAllComments = exports.createComment = void 0;
const comment_1 = __importDefault(require("../models/comment"));
// Create a new comment
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = new comment_1.default({
        postId: req.body.postId,
        content: req.body.content,
        author: req.body.author,
    });
    try {
        const newComment = yield comment.save();
        res.status(201).json(newComment);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.createComment = createComment;
// Get all comments
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield comment_1.default.find();
        res.json(comments);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getAllComments = getAllComments;
// Get comments by post ID
const getCommentsByPostId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield comment_1.default.find({ postId: req.params.postId });
        res.json(comments);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getCommentsByPostId = getCommentsByPostId;
// Update a comment
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield comment_1.default.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        if (req.body.content)
            comment.content = req.body.content;
        if (req.body.author)
            comment.author = req.body.author;
        comment.updatedAt = new Date();
        const updatedComment = yield comment.save();
        res.json(updatedComment);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.updateComment = updateComment;
// Delete a comment
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield comment_1.default.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        yield comment.deleteOne();
        res.json({ message: "Comment deleted" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.deleteComment = deleteComment;
