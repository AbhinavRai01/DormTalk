const express = require('express');

const router = express.Router();

const { getAnswersForQuestion, addAnswer, getAnswerForProfile, increaseLike, decreaseLike } = require('../controllers/answerController');

router.get('/question/:id', getAnswersForQuestion); 
router.post('/add', addAnswer);
router.get('/profile/:id', getAnswerForProfile); 
router.post('/like', increaseLike);
router.post('/unlike', decreaseLike);

// Export the router
module.exports = router;