import express from 'express';
import { isAuthorized } from '../middleware/userAuth'
import { findAllPosts, getOnePost, createPost, deletePost, updatePost } from '../controller/PostController';


const router = express.Router();


router.get('/posts', isAuthorized, findAllPosts);
router.get('/single-post/:id', isAuthorized, getOnePost);
router.post('/create-post', isAuthorized, createPost);
router.delete('/delete-post/:id', isAuthorized, deletePost);
router.put('/edit-post/:id', isAuthorized, updatePost);



export default router;