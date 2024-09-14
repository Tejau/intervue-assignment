import React, { useState, useEffect } from 'react';

const PreviousPollResults = () => {
  const [previousPolls, setPreviousPolls] = useState([]);  // State to hold previous poll data
  const [error, setError] = useState(null);  // Error state

  // Fetch all previous poll data from the backend when component mounts
  useEffect(() => {
    const fetchPreviousPolls = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/polls/questions');  // Adjust with your API route
        const data = await response.json();
        setPreviousPolls(data);
        console.log('Previous poll data fetched:', data);
      } catch (err) {
        console.error('Error fetching previous poll results:', err);
        setError('Failed to load previous poll results.');
      }
    };

    fetchPreviousPolls();  // Call the fetch function when the component mounts
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!previousPolls || previousPolls.length === 0) {
    return <div>Loading previous poll results...</div>;  // Show a loading state if no previous polls are available
  }

  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-6">Previous Poll Results</h2>

      {/* Render each previous poll like the current poll result */}
      {previousPolls.map((poll, pollIndex) => {
        // Calculate totalVotes by summing the length of selectedBy for all options
        const totalVotes = poll.options.reduce((acc, option) => acc + option.selectedBy.length, 0);

        return (
          <div key={poll._id} className="mb-8">
            {/* Poll Question */}
            <div className="bg-gray-800 text-white p-4 rounded-t-md">
              <h3>{poll.question}</h3>
            </div>

            {/* Poll Options with Percentages */}
            <div className="mt-8">
              {poll.options.map((option, index) => {
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
        );
      })}
    </div>
  );
};

export default PreviousPollResults;
