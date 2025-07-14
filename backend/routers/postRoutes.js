const express = require('express');
const router = express.Router();

const {createPost, getPostsByUser, getPostById, updateLikes, getFeedPosts, deletePost} = require('../controllers/postController');

router.post('/create', createPost);
router.get('/user/:userId', getPostsByUser);
router.post('/updateLikes', updateLikes);
router.post('/feed', getFeedPosts);
router.get('/:postId', getPostById);
router.delete('/:postId', deletePost);

module.exports = router;