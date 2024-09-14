const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { initSocket } = require('./helpers/Socket');  // Import socket initialization
const studentRoutes = require('./routes/studentRoutes');
const pollRoutes = require('./routes/pollRoutes');

const app = express();
const httpServer = createServer(app);

const io = initSocket(httpServer);  // Initialize Socket.IO

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/polls', pollRoutes);  // Ensure you use the poll routes

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/pollApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = 8000;

// Start the server
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
