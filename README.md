# Intervue Assignment

This project contains a live polling system, built using Node.js for the backend (Express + Socket.IO) and React for the frontend. It allows students and teachers to interact in live polls with real-time updates. The project is containerized using Docker for easy setup and deployment.

## Features
- **Live Polling**: Teachers can create polls, and students can participate in real-time.
- **Real-time Updates**: Poll results are updated live using Socket.IO.
- **Role-based Functionality**: Students can answer polls, and teachers can create/manage polls.
- **Floating Chat**: A floating chat box is available across all pages for real-time communication (not completely implemented).

## Project Structure
```bash
project-root/
│
├── client/                     # React Frontend
│   ├── src/
│   ├── Dockerfile               # Dockerfile for the frontend
│   └── package.json
│
├── server/                     # Node.js Backend
│   ├── routes/                 # Routes for API
│   ├── helpers/                # Helper files for DB and Socket setup
│   ├── models/                 # Mongoose models (Poll, Student)
│   ├── Dockerfile              # Dockerfile for the backend
│   ├── server.js               # Main server file
│   └── package.json
│
├── docker-compose.yml           # Docker Compose to run client and server
└── README.md                    # Project documentation
