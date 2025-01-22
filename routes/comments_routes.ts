import express, { Request, Response } from 'express';
import { createComment, getAllComments, getCommentsByPostId, updateComment, deleteComment } from '../controllers/comments_controller';

const router = express.Router();

// Route to create a new comment
router.post('/', createComment);

// Route to get all comments
router.get('/', getAllComments);

// Route to get comments by post ID
router.get('/post/:postId', getCommentsByPostId);

// Route to update a comment
router.put('/:id', updateComment);

// Route to delete a comment
router.delete('/:id', deleteComment);

export default router;
