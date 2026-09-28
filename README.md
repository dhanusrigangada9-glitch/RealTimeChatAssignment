# Real-Time Chat Application

A full-stack real-time chat application built using React, Node.js, Express, Socket.io, and MongoDB. The application allows multiple users to join a shared chat room, send messages instantly, view online users, and retain chat history after refreshing the page.

## Features

* Real-time messaging using Socket.io
* Multiple users can chat simultaneously
* Messages are stored permanently in MongoDB
* Chat history loads automatically after refresh
* User join and leave notifications
* Online user count
* Message timestamps
* Username-based chat identity
* Responsive and clean user interface
* REST API for retrieving and storing messages
* MongoDB Atlas cloud database

## Tech Stack

### Frontend

* React
* Vite
* Socket.io Client
* CSS

### Backend

* Node.js
* Express.js
* Socket.io
* Mongoose
* dotenv
* CORS

### Database

* MongoDB Atlas

## Project Structure

```text
RealTimeChatAssignment/
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── .gitignore
└── README.md
```

## How It Works

1. A user enters a username and joins the chat.
2. The React frontend connects to the Node.js backend through Socket.io.
3. Messages are sent through Socket.io in real time.
4. The backend saves each message to MongoDB.
5. The backend broadcasts the message to all connected users.
6. When the page is refreshed, the frontend requests previous messages through the REST API.
7. Join and leave events are broadcast to connected users.

## REST API

### Get Chat History

```http
GET /api/messages
```

Returns previously stored chat messages.

### Save a Message

```http
POST /api/messages
```

Example request:

```json
{
  "username": "Dhanusri",
  "message": "Hello!",
  "time": "10:30 PM"
}
```

## Socket.io Events

### Client → Server

```text
user_join
send_message
```

### Server → Client

```text
receive_message
online_users
system_message
```

## Database

MongoDB Atlas is used to store chat messages.

Each message contains:

* Username
* Message content
* Time
* Created timestamp

The database allows messages to remain available after refreshing the browser.

## Environment Variables

The backend uses an environment variable for the MongoDB connection.

Create a `.env` file inside the backend folder:

```env
MONGO_URI=your_mongodb_connection_string
```

The `.env` file is excluded from GitHub using `.gitignore`.

## Running the Project Locally

### Backend

Open a terminal inside the `backend` folder and install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Frontend

Open another terminal inside the `frontend` folder:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite, for example:

```text
http://localhost:5173
```

## Testing

The application was tested with multiple browser tabs to verify:

* Real-time message delivery
* Multiple connected users
* Online user count
* Join notifications
* Leave notifications
* Message persistence after refresh
* MongoDB message storage
* Empty username validation

## Design Decisions

Socket.io was selected because the application requires two-way real-time communication between multiple connected clients.

MongoDB Atlas was selected to provide persistent cloud storage for messages.

React was used for the frontend because it provides a component-based structure and efficient UI updates.

Express.js provides lightweight REST APIs and works well with the Socket.io backend.

## Assumptions

* The application currently uses a shared chat room.
* User authentication is not required for the core assignment.
* Usernames are used as the chat identity.
* MongoDB Atlas is configured before starting the backend.
* The application is intended for demonstration and assignment evaluation.

## Future Improvements

* User authentication
* Private chat rooms
* Typing indicators
* Message delivery status
* Read receipts
* Online/offline user status
* Message search
* File and image sharing
* Production deployment

## Author

**Dhanusri Gangada**

B.Sc. Data Science

GitHub: `https://github.com/dhanusrigangada9-glitch`

## Project Repository

This repository contains the complete source code for the Real-Time Chat Application.
