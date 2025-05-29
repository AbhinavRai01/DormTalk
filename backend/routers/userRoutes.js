const express = require('express');
const router = express.Router();
const { getUser, loginUser, signupUser,unfollowUser, likeAnswer,likeQuestion,followUser,increaseFollowers,decreaseFollowers } = require('../controllers/userController');

router.get('/:id', getUser);
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/likeAnswer', likeAnswer);
router.post('/likeQuestion', likeQuestion);
router.post('/increaseFollowers', increaseFollowers);
router.post('/decreaseFollowers', decreaseFollowers);
router.post('/followuser',followUser);
router.post('/unfollowuser', unfollowUser);

module.exports = router;

