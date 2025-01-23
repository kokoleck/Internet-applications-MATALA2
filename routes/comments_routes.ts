import express from 'express';
import authenticateJWT from '../middlewares/authMiddleware';
import { createComment, getAllComments, getCommentsByPostId, updateComment, deleteComment } from '../controllers/comments_controller';

const router = express.Router();

// Route to create a new comment (protected)
router.post('/', authenticateJWT, createComment);

// Route to get all comments (protected)
router.get('/', authenticateJWT, getAllComments);

// Route to get comments by post ID (protected)
router.get('/post/:postId', authenticateJWT, getCommentsByPostId);

// Route to update a comment (protected)
router.put('/:id', authenticateJWT, updateComment);

// Route to delete a comment (protected)
router.delete('/:id', authenticateJWT, deleteComment);

export default router;
