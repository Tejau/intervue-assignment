import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CountdownTimer from '../elements/CountDownTimer';
import PollResults from './PollResults';
import axios from 'axios';
import CircularLoader from '../elements/CircularLoader';
const QuestionAnswer = () => {
  const { studentId } = useParams();  // Access studentId from the route params
  const [questionData, setQuestionData] = useState(null);  // State to store question data
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);  // State to control rendering of PollResults
  const [pollId, setPollId] = useState(null);  // Store pollId for use in PollResults
  const [hasSubmitted, setHasSubmitted] = useState(false);  // State to track if the user has already submitted
  const [loading, setLoading] = useState(true);  // Loading state for submitting answers
  const [error, setError] = useState(null);  // Error state for failed submissions

  // Fetch poll question and check if student already submitted from backend
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        // Fetch question data
        const questionResponse = await axios.get('http://localhost:8000/api/polls/questions');  // Replace with correct API endpoint
        if (questionResponse.data.length > 0) {
          setQuestionData(questionResponse.data[0]);  // Assume the first question for demo purposes
          setPollId(questionResponse.data[0]._id);  // Store pollId for submitting answers later

          // Check if the student has already submitted the answer
          const submissionResponse = await axios.get(`http://localhost:8000/api/polls/check-submission/${questionResponse.data[0]._id}/${studentId}`);
          setHasSubmitted(submissionResponse.data.hasSubmitted);
        } else {
          console.log('No questions available');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();  // Call the fetch function when the component mounts
  }, [studentId]);

  // Handler for selecting an answer
  const handleSelectAnswer = (index) => {
    setSelectedAnswer(index);
  };

  // Submit the selected answer to the backend
  const submitAnswer = async () => {
    if (selectedAnswer !== null) {
      setLoading(true);
      setError(null);  // Clear any previous error state
      try {
        // Submit the answer to the backend, including the studentId from the route params
        const response = await axios.post(`http://localhost:8000/api/polls/answer`, {
          pollId,
          studentId,  // Use studentId from route params
          answerIndex: selectedAnswer,
        });
        console.log('Answer submitted:', response.data);
        setShowResults(true);  // Show results after successful submission
      } catch (error) {
        console.error('Error submitting answer:', error);
        setError('Failed to submit answer. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('No answer selected. Auto-submitting or manually submitting.');
      setShowResults(true);  // Show results even if no answer is selected
    }
  };

  // When time is up, auto-submit the answer
  const handleTimeUp = () => {
    submitAnswer();
  };

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // If the user has already submitted, show poll results directly
  if (hasSubmitted || showResults) {
    return (
      <PollResults
        pollId={pollId}  // Pass pollId to PollResults for fetching poll results
        isStudent={true}
      />
    );
  }

  if (!questionData || !questionData.options) {
    return <CircularLoader/>;  // Show a loading state while fetching question data
  }

  // Render question and answer options if the user hasn't submitted yet
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
        {/* Question Header with Timer */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Question </h3>
          {/* Countdown Timer */}
          <CountdownTimer initialTime={60} onTimeUp={handleTimeUp} /> {/* 60 seconds timer */}
        </div>

        {/* Question */}
        <div className="bg-gray-800 text-white p-4 rounded-t-md mb-6">
          {questionData.question}
        </div>

        {/* Answer Options */}
        {questionData.options.map((option, index) => (
          <div
            key={index}
            className={`p-4 mb-4 rounded-full flex items-center justify-between cursor-pointer border ${
              selectedAnswer === index ? 'border-purple-500 bg-purple-100' : 'border-gray-300'
            }`}
            onClick={() => handleSelectAnswer(index)}
          >
            {/* Option Number */}
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-purple-500">
                {index + 1}
              </div>
              <span className="ml-4 text-gray-700 font-semibold">{option.text}</span>
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <button
          className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 w-full"
          onClick={submitAnswer}
          disabled={loading}  // Disable the button while loading
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {/* Error Message */}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default QuestionAnswer;
