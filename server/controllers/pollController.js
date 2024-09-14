const Poll = require('../models/pollModel');
const Student = require('../models/studentModel');
const { getIoInstance } = require('../helpers/Socket');  // Import the global io instance

// Submit an answer for a poll (update the selected option and record the student)


// Get all poll questions
// Get all polls
const getAllPolls = async (req, res) => {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });  // -1 for descending order
        res.status(200).json(polls);      // Return the list of polls
    } catch (error) {
        res.status(500).json({ message: 'Error fetching polls', error });
    }
};

const getPollById = async (req, res) => {
    const { pollId } = req.params;

    try {
        const poll = await Poll.findById(pollId).populate('options.selectedBy', 'name email');
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }
        res.status(200).json(poll);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching poll', error });
    }
}
// Create a new poll
const createNewPoll = async (req, res) => {
    const { question, options } = req.body;

    // Validate input
    if (!question || !Array.isArray(options) || options.length === 0) {
        return res.status(400).json({ message: 'Question and at least one option are required' });
    }

    try {
        // Create a new poll with the given question and options
        const poll = new Poll({
            question,
            options: options.map(option => ({ text: option })) // Create an array of option objects
        });

        // Save poll to database
        await poll.save();
        res.status(201).json(poll); // Return the newly created poll
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error creating poll', error });
    }
};

// Fetch poll results and emit updates
const getPollResults = async (req, res) => {
    const { pollId } = req.params;
  
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) {
        return res.status(404).json({ message: 'Poll not found' });
      }
  
      // Emit the poll results to all connected clients via Socket.IO
      const io = getIoInstance();  // Get the initialized io instance
      io.emit('poll-results-update', poll);
  
      res.status(200).json(poll);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching poll results', error });
    }
  };
  
  const checkIfSubmitted = async (req, res) => {
    const { pollId, studentId } = req.params;
  
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) {
        return res.status(404).json({ message: 'Poll not found' });
      }
  
      // Check if the student ID exists in any of the selectedBy arrays
      let hasSubmitted = false;
      poll.options.forEach((option) => {
        if (option.selectedBy.includes(studentId)) {
          hasSubmitted = true;
        }
      });
  
      // Return the result of the check
      res.status(200).json({ hasSubmitted });
    } catch (error) {
      console.error('Error checking submission:', error);
      res.status(500).json({ message: 'Error checking submission', error });
    }
  };
  
// Handle answer submission, but don't emit Socket.IO events here
const submitAnswer = async (req, res) => {
    const { pollId, studentId, answerIndex } = req.body;

    try {
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Update the selected option by pushing the student ID
        poll.options[answerIndex].selectedBy.push(studentId);

        // Save the updated poll
        await poll.save();

        res.status(200).json({ message: 'Answer submitted successfully', poll });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting answer', error });
    }
};

const checkIfAllStudentsAnswered = async (req, res) => {
    try {
      // Find the latest poll by sorting on the createdAt field
      const latestPoll = await Poll.findOne().sort({ createdAt: -1 });
      if (!latestPoll) {
        return res.status(404).json({ message: 'No polls found' });
      }
  
      // Fetch all students
      const students = await Student.find();
      const totalStudents = students.length;
  
      // Count how many students have answered the latest poll
      let answeredCount = 0;
      students.forEach((student) => {
        latestPoll.options.forEach((option) => {
          if (option.selectedBy.includes(student._id)) {
            answeredCount++;
          }
        });
      });
  
      // Determine if all students have answered
      const allAnswered = answeredCount >= totalStudents;
  
      // Return the allAnswered flag along with some useful data
      res.status(200).json({ allAnswered, poll: latestPoll });
    } catch (error) {
      res.status(500).json({ message: 'Error checking if all students answered', error });
    }
  };
  const getLatestPoll = async (req, res) => {
    try {
      // Find the latest poll by sorting on the createdAt field
      const latestPoll = await Poll.findOne().sort({ createdAt: -1 });
      if (!latestPoll) {
        return res.status(404).json({ message: 'No polls found' });
      }
      res.status(200).json(latestPoll);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching latest poll', error });
    }
  };
  

module.exports = { createNewPoll, submitAnswer, getPollResults, checkIfSubmitted, getAllPolls, checkIfAllStudentsAnswered, getLatestPoll };
