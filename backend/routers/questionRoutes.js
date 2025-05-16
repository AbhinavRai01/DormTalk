
const express = require('express');

const router = express.Router();
const { getQuestions, getQuestion, addQuestion } = require('../controllers/questionsController');

// Route to get all questions
router.get('/', getQuestions);

// Route to get a specific question by ID
router.get('/:id', getQuestion);

// Route to add a new question
router.post('/add', addQuestion);

// Export the router
module.exports = router;

