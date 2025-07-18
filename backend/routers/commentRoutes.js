const express = require('express');
const router = express.Router();

const { createComment, getCommentsByParentID, deleteComment, updateLikes } = require('../controllers/commentController');

router.post('/create', createComment);
router.get('/parent/:parentID', getCommentsByParentID);
router.delete('/:commentId', deleteComment);
router.put('/:commentId/likes', updateLikes);

module.exports = router;