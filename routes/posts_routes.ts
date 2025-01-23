import { Router } from 'express';
import authenticateJWT from '../middlewares/authMiddleware';
import { createPost, getAllPosts, getPostById, deletePost } from '../controllers/post';

const router = Router();

// Route to create a new post (protected)
router.post('/', authenticateJWT, createPost);

// Route to get all posts (protected)
router.get('/', authenticateJWT, getAllPosts);

// Route to get a post by ID (protected)
router.get('/:id', authenticateJWT, getPostById);

// Route to delete a post by ID (protected)
router.delete('/:id', authenticateJWT, deletePost);

export default router;
