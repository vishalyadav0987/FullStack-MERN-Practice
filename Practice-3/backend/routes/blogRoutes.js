const express = require('express');
const router = express.Router();
const { createBlog, getAllBlogs, getAllBlogOfUser, updateBlog, deleteBlog, likeAndDislikeBlog, commentOnBlog, getBlogById } = require('../controllers/blogController');
const { authMiddleware } = require('../middleware/authMiddleware')



router.post('/create', authMiddleware, createBlog);
router.get('/all', getAllBlogs);
router.get('/single:id', getBlogById);
router.get('/all-blog-user', authMiddleware, getAllBlogOfUser);
router.put('/update/:id', authMiddleware, updateBlog);
router.delete('/remove/:id', deleteBlog);
router.post('/comment', authMiddleware, commentOnBlog);
router.get('/get-comments/:id', getAllBlogOfUser);
router.post('/like-dislike', authMiddleware, likeAndDislikeBlog);

module.exports = router;
