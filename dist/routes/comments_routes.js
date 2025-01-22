"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comments_controller_1 = require("../controllers/comments_controller");
const router = express_1.default.Router();
// Route to create a new comment
router.post('/', comments_controller_1.createComment);
// Route to get all comments
router.get('/', comments_controller_1.getAllComments);
// Route to get comments by post ID
router.get('/post/:postId', comments_controller_1.getCommentsByPostId);
// Route to update a comment
router.put('/:id', comments_controller_1.updateComment);
// Route to delete a comment
router.delete('/:id', comments_controller_1.deleteComment);
exports.default = router;
