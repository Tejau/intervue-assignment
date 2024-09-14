import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios for API requests

const StudentNameEntry = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);  // Error handling state
  const [loading, setLoading] = useState(false);  // Loading state
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }

    setLoading(true);
    setError(null);  // Clear any previous errors

    try {
      // Send POST request to backend to add the student
      const response = await axios.post('http://localhost:8000/api/students/loginOrRegisterStudent', { name });
      
      // If successful, store the studentId and navigate to the next screen with studentId in route params
      const { studentId } = response.data;
      navigate(`/student/question/${studentId}`);  // Navigate to the next step, passing studentId in route
    } catch (error) {
      setError('Failed to add student. Please try again.');
      console.error('Error adding student:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6">Let’s <span className="text-purple-600">Get Started</span></h1>
      <p className="text-gray-500 mb-8">
        If you’re a student, you’ll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates.
      </p>

      <div className="w-full max-w-md">
        <label className="block text-gray-700 text-sm font-bold mb-2">Enter your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6"
          placeholder="Enter your name"
        />

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <button
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 w-full"
          onClick={handleContinue}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default StudentNameEntry;
