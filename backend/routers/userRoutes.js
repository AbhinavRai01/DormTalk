const express = require('express');
const router = express.Router();
const { getUser, loginUser, signupUser,unfollowUser, likeAnswer,
    likeQuestion,followUser,increaseFollowers,decreaseFollowers,updateProfile,
     getProfilePicture, joinCluster, leaveCluster } = require('../controllers/userController');

router.get('/getpfp/:id', getProfilePicture);
router.get('/:id', getUser);
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/likeAnswer', likeAnswer);
router.post('/likeQuestion', likeQuestion);
router.post('/increaseFollowers', increaseFollowers);
router.post('/decreaseFollowers', decreaseFollowers);
router.post('/followuser',followUser);
router.post('/unfollowuser', unfollowUser);
router.post('/update/:id',updateProfile);
router.post('/joinCluster', joinCluster);
router.post('/leaveCluster', leaveCluster);

module.exports = router;

