import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';  // Import Socket.IO client
import PreviousPollResults from './PreviousPollResults';  // Import a new component for viewing previous poll results
import CircularLoader from '../elements/CircularLoader';
const socket = io('http://localhost:8000');  // Connect to the Socket.IO server

const PollResults = ({ pollId, isStudent }) => {
  const [pollData, setPollData] = useState(null);  // State to hold poll data
  const [error, setError] = useState(null);  // Error state
  const [showPreviousPolls, setShowPreviousPolls] = useState(false); // State to control showing previous polls

  // Fetch initial poll data from the backend when component mounts
  useEffect(() => {
    const fetchPollResults = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/polls/results/${pollId}`);
        const data = await response.json();
        setPollData(data);
        console.log('Initial poll data fetched:', data);
      } catch (err) {
        console.error('Error fetching poll results:', err);
        setError('Failed to load poll results.');
      }
    };

    if (pollId) {
      fetchPollResults();
    }

    // Listen for real-time poll updates via WebSocket
    socket.on('poll-results-update', (updatedPoll) => {
      console.log('Received real-time poll update:', updatedPoll);
      if (updatedPoll._id === pollId) {
        setPollData(updatedPoll);
      }
    });

    return () => {
      socket.off('poll-results-update');  // Clean up the listener when component unmounts
    };
  }, [pollId]);

  // Toggle showing previous polls
  const handlePreviousPollsClick = () => {
    setShowPreviousPolls(!showPreviousPolls);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!pollData || !pollData.options) {
    return <CircularLoader/>;  // Show a loading state if pollData is not yet available
  }

  // Calculate totalVotes by summing the length of selectedBy for all options
  const totalVotes = pollData.options.reduce((acc, option) => acc + option.selectedBy.length, 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Top-right button to view previous poll results */}
      {!isStudent && <div className="w-full max-w-2xl flex justify-end mb-4">
        <button 
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          onClick={handlePreviousPollsClick}
        >
          {showPreviousPolls ? 'Hide Poll History' : 'View Poll History'}
        </button>
      </div>}

      {/* If showPreviousPolls is true, render the PreviousPollResults component */}
      {showPreviousPolls  ? (
        <PreviousPollResults />
      ) : (
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
          <div className="bg-gray-800 text-white p-4 rounded-t-md">
            <h3>{pollData.question}</h3>
          </div>

          {/* Increased gap between question and options by using mt-8 */}
          <div className="mt-8">
            {/* Poll Options with Percentages */}
            {pollData.options.map((option, index) => {
              // Calculate percentage for each option
              const percentage = totalVotes > 0 
                ? ((option.selectedBy.length / totalVotes) * 100).toFixed(1) 
                : 0;

              return (
                <div key={index} className="relative w-full flex items-center p-4 mb-4 rounded-md bg-gray-200 overflow-hidden">
                  <div className="absolute inset-0 h-full bg-purple-500" style={{ width: `${percentage}%` }}></div>
                  <div className="relative flex items-center w-full z-10">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-purple-500 mr-4">{index + 1}</div>
                    <span className="text-gray-700 font-semibold">{option.text}</span>
                    <span className="ml-auto text-gray-700 font-semibold z-10">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PollResults;
