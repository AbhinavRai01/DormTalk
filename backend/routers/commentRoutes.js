const express = require('express');
const router = express.Router();

const { createComment, getCommentsByParentID, deleteComment } = require('../controllers/commentController');

router.post('/create', createComment);
router.get('/parent/:parentID', getCommentsByParentID);
router.delete('/:commentId', deleteComment);

module.exports = router;