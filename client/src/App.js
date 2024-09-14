// src/App.js

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes';
import FloatingChat from './FloatingChat';  // The floating chat component

function App() {
  return (
    <Router>
    <div>
      {/* Render app routes */}
      <AppRoutes />

      {/* Floating chat is outside the routes, so it remains visible on all pages */}
      {/* <FloatingChat /> */}
    </div>
  </Router>

  );
}

export default App;
