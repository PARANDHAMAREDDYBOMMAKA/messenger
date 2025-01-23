

# Messenger App

This is a full-stack Messenger app built using the MERN stack (MongoDB, Express.js, React, Node.js). The app supports real-time messaging, user authentication, and notifications using WebSockets.

## Requirements

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [MongoDB](https://www.mongodb.com/) (locally or use MongoDB Atlas for cloud database)

## Getting Started

### 1. Fork and Clone the Repository

To get started, fork this repository to your GitHub account, then clone it to your local machine:

git clone https://github.com/your-username/messenger-app.git
cd messenger-app `

### 2\. Set up the Backend

#### a. Install Backend Dependencies

Navigate to the backend folder and install the necessary dependencies:

`cd backend`

`npm install`

#### b. Start the Backend Server

To start the backend server, run the following command:

`npm run server`

The backend server will be running on <http://localhost:8000> by default.

### 3\. Set up the Frontend

#### a. Install Frontend Dependencies

Navigate to the frontend folder and install the necessary dependencies:

`cd frontend`

`npm install`

#### b. Start the Frontend

To start the frontend, run the following command:

`npm run dev`

The frontend will be running on <http://localhost:5173> by default.

Environment Variables
---------------------

Make sure to set up the necessary environment variables for both backend and frontend.

### Backend Environment Variables

Create a .env file inside the backend folder with the following variables:

`MONGO_URI=your-mongodb-uri`

`JWT_SECRET=your-secret-key`

`PORT=8000`

Replace `your-mongodb-uri` with the URI for your MongoDB instance and `your-secret-key` with your secret for JWT.

### Frontend Environment Variables

Create a .env file inside the frontend folder with the following variable:

This will link your frontend to the backend server.

Features
--------

-   **User Authentication**: Register and login using JWT tokens.
-   **Real-Time Messaging**: Instant messaging with WebSockets (Socket.io).
-   **User Profile**: Manage user profiles, update information.
-   **Notifications**: Get notified of new messages in real-time.
-   **Message History**: View past messages in each chat.

Technologies Used
-----------------

-   **MongoDB**: NoSQL database for storing messages and user data.
-   **Express.js**: Backend framework for handling API routes and middleware.
-   **React.js**: Frontend framework to build the UI (using hooks and context).
-   **Node.js**: JavaScript runtime for server-side logic.
-   **Socket.io**: Real-time communication for messaging.
-   **Tailwind CSS**: Utility-first CSS framework for styling.
