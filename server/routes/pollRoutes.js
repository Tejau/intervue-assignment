const express = require('express');
const { getAllPolls, submitAnswer, getPollResults, createNewPoll, checkIfSubmitted, checkIfAllStudentsAnswered } = require('../controllers/pollController');

const router = express.Router();

// Routes for poll operations
router.get('/questions', getAllPolls);            // Get all poll questions
router.post('/answer', submitAnswer);              // Submit an answer
router.post('/create', createNewPoll);             // Create a new poll
router.get('/results/:pollId', getPollResults);    // Get poll results
router.get('/check-submission/:pollId/:studentId', checkIfSubmitted);
router.get('/check-all-answered', checkIfAllStudentsAnswered);
router.get('/polls', getAllPolls);  // New route for fetching all polls

module.exports = router;
