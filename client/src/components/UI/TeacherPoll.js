import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PollResults from './PollResults';

const TeacherPoll = () => {
  const [showResults, setShowResults] = useState(false); // Boolean to control showing results
  const [question, setQuestion] = useState(''); // Poll question state
  const [options, setOptions] = useState([{ text: '', isCorrect: false }]); // Poll options state
  const [timer, setTimer] = useState(60); // Timer state, default to 60 seconds
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [pollId, setPollId] = useState(null); // State to store pollId after poll creation
  const [allAnswered, setAllAnswered] = useState(false); // State to track if all students have answered

  const fetchLatestPollAndCheckAnswers = async () => {
    setLoading(true);
    try {
      // Fetch the latest poll
      
      // Check if all students have answered the latest poll
      const answeredResponse = await axios.get('http://localhost:8000/api/polls/check-all-answered');
      if(answeredResponse.data.allAnswered==false){
        setPollId(answeredResponse?.data?.poll?._id)
        setShowResults(true)
      }
      setAllAnswered(answeredResponse?.data?.allAnswered);
    } catch (error) {
      console.error('Error fetching latest poll or checking if all students answered:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestPollAndCheckAnswers();
  }, []);
  // Handle adding new option
  const addOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  // Handle option text change
  const handleOptionTextChange = (index, newText) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = newText;
    setOptions(updatedOptions);
  };

  // Handle isCorrect change
  const handleIsCorrectChange = (index, isCorrect) => {
    const updatedOptions = [...options];
    updatedOptions[index].isCorrect = isCorrect;
    setOptions(updatedOptions);
  };

  // Handle deleting an option
  const deleteOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  // Function to submit the poll to the backend
  const createPoll = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare data for backend
      const pollData = {
        question,
        options: options.map((option) => option.text), // Only send option text to backend
      };

      // Send POST request to backend
      const response = await axios.post('http://localhost:8000/api/polls/create', pollData);

      // If successful, save the poll ID and show results
      setPollId(response.data._id);  // Save pollId from the backend response
      setShowResults(true);
      console.log('Poll created successfully:', response.data);
    } catch (error) {
      console.error('Error creating poll:', error);
      setError('Failed to create poll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showResults ? (
        <PollResults pollId={pollId} isStudent={false} /> // Pass pollId to PollResults component
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
          <h1 className="text-4xl font-bold mb-6">
            Let’s <span className="text-purple-600">Get Started</span>
          </h1>
          <p className="text-gray-500 mb-8">
            You’ll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
          </p>

          <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
            {/* Question Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Enter your question</label>
              <textarea
                className="w-full border border-gray-300 p-4 rounded-md h-24"
                placeholder="Type your question here..."
                maxLength="100"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <div className="text-right text-gray-400">{question.length}/100</div>
            </div>

            {/* Timer Dropdown */}
            <div className="mb-4 flex justify-between items-center">
              <label className="block text-gray-700 text-sm font-bold mb-2"> Time Limit</label>
              
                <span>60 seconds</span>
                {/* <option value={120}>2 minutes</option> */}
              {/* </select> */}
            </div>

            {/* Options Section */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Edit Options</label>

              {options.map((option, index) => (
                <div className="flex items-center mb-2" key={index}>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(index, e.target.value)}
                    className="flex-grow border border-gray-300 p-2 rounded-md mr-4"
                    placeholder={`Option ${index + 1}`}
                  />
                  <div>
                    <label className="mr-2">Is it Correct?</label>
                    <input
                      type="radio"
                      name={`isCorrect${index}`}
                      checked={option.isCorrect === true}
                      onChange={() => handleIsCorrectChange(index, true)}
                    />{' '}
                    Yes
                    <input
                      type="radio"
                      name={`isCorrect${index}`}
                      className="ml-4"
                      checked={option.isCorrect === false}
                      onChange={() => handleIsCorrectChange(index, false)}
                    />{' '}
                    No
                  </div>
                  {/* Delete Option Button */}
                  <button
                    className="ml-4 text-red-500 hover:underline"
                    onClick={() => deleteOption(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button
                className="text-purple-500 text-sm font-semibold hover:underline"
                onClick={addOption}
              >
                + Add More Option
              </button>
            </div>

            {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}

            <button
              className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              onClick={createPoll}
              disabled={loading}
            >
              {loading ? 'Creating Poll...' : 'Ask Question'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPoll;
