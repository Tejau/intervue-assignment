// src/routes/AppRoutes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RoleSelection from './components/UI/RoleSelection';
import TeacherPoll from './components/UI/TeacherPoll'; // Import the new component
import StudentNameEntry from './components/UI/StudentNameEntry';
import QuestionAnswer from './components/UI/QuestionAnswer';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Define your routes here */}
      <Route path="/" element={<RoleSelection />} />
      <Route path="/teacher" element={<TeacherPoll />} /> {/* Teacher poll screen route */}
      <Route path="/student" element={<StudentNameEntry />} /> {/* Student flow */}
      <Route path="/student/question/:studentId" element={<QuestionAnswer />} />

      {/* Add more routes for other pages/screens */}
    </Routes>
  );
}

export default AppRoutes;
