
const express = require('express');

const router = express.Router();
const { getQuestions, getQuestion, addQuestion,increaseLike,decreaseLike, uploadSageAnswer } = require('../controllers/questionsController');
const {searchQuestion} = require('../controllers/searchQuestion')

// Route to get all questions
router.get('/', getQuestions);


// Route to add a new question
router.post('/add', addQuestion);

router.post('/like', increaseLike);
router.post('/unlike', decreaseLike);

router.post('/search', searchQuestion);

// Route to get a specific question by ID
router.get('/:id', getQuestion);

router.post('/sageanswer/:id', uploadSageAnswer);

// Export the router
module.exports = router;

