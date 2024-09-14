import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RoleSelection = () => {
  // State to track the selected role (student or teacher)
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate(); // Initialize the navigation function

  const handleSelectRole = (role) => {
    setSelectedRole(role); // Update the selected role when clicked
  };
  const handleContinue = () => {
    if (selectedRole === 'teacher') {
      navigate('/teacher'); // Navigate to the Teacher view
    } else if (selectedRole === 'student') {
      navigate('/student'); // Navigate to the Student view
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to the <span className="text-purple-600">Live Polling System</span>
        </h1>
        <p className="text-gray-500 mb-8">
          Please select the role that best describes you to begin using the live polling system
        </p>

        <div className="flex justify-center mb-8">
          {/* Student selection */}
          <div
            className={`mr-4 p-4 rounded-lg cursor-pointer ${
              selectedRole === 'student'
                ? 'border border-purple-500 bg-purple-100'
                : 'border border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => handleSelectRole('student')}
          >
            <h2 className="font-semibold text-lg">I'm a Student</h2>
            <p className="text-gray-500">Can Answer the polls and see the live results</p>
          </div>

          {/* Teacher selection */}
          <div
            className={`p-4 rounded-lg cursor-pointer ${
              selectedRole === 'teacher'
                ? 'border border-purple-500 bg-purple-100'
                : 'border border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => handleSelectRole('teacher')}
          >
            <h2 className="font-semibold text-lg">I'm a Teacher</h2>
            <p className="text-gray-500">Submit answers and view live poll results in real-time</p>
          </div>
        </div>

        <button 
        onClick={handleContinue}
        className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
          Continue
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
