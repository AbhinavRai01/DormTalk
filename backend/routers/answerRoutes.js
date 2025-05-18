const express = require('express');

const router = express.Router();

const { getAnswersForQuestion, addAnswer, getAnswerForProfile } = require('../controllers/answerController');

router.get('/question/:id', getAnswersForQuestion); 
router.post('/add', addAnswer);
router.get('/profile/:id', getAnswerForProfile); 

// Export the router
module.exports = router;