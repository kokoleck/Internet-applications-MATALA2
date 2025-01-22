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
exports.deletePost = exports.getPostById = exports.getAllPosts = exports.createPost = void 0;
exports.getAll = getAll;
exports.create = create;
exports.getById = getById;
const posts_model_1 = __importDefault(require("../models/posts_model"));
// יצירת פוסט חדש
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, content } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId; // חיבור למידע המשתמש (הJWT), חשוב לבדוק אם יש את המידע
    if (!userId) {
        res.status(400).json({ message: "User not authenticated" });
        return;
    }
    try {
        const newPost = new posts_model_1.default({
            title,
            content,
            senderId: userId, // הוספת מזהה המשתמש
        });
        yield newPost.save();
        res.status(201).json(newPost);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.createPost = createPost;
// קבלת כל הפוסטים
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ownerFilter = req.query.owner;
    try {
        let posts;
        if (ownerFilter) {
            posts = yield posts_model_1.default.find({ owner: ownerFilter });
        }
        else {
            posts = yield posts_model_1.default.find();
        }
        res.status(200).send(posts);
    }
    catch (err) {
        res.status(400).send({ message: err.message });
    }
});
exports.getAllPosts = getAllPosts;
// קבלת פוסט לפי ID
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    try {
        const post = yield posts_model_1.default.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json(post);
    }
    catch (err) {
        res.status(400).send({ message: err.message });
    }
});
exports.getPostById = getPostById;
// מחיקת פוסט
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    try {
        const deletedPost = yield posts_model_1.default.findByIdAndDelete(postId);
        if (!deletedPost) {
            res.status(404).send("Post not found");
            return;
        }
        res.status(200).send({ message: "Post deleted successfully", deletedPost });
    }
    catch (err) {
        res.status(400).send({ message: err.message });
    }
});
exports.deletePost = deletePost;
function getAll(arg0, getAll) {
    throw new Error('Function not implemented.');
}
function create(arg0, authMiddleware, create) {
    throw new Error('Function not implemented.');
}
function getById(arg0, getById) {
    throw new Error('Function not implemented.');
}
