import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);

  // Load saved messages from MongoDB
  useEffect(() => {
    fetch("http://localhost:5000/api/messages")
      .then((response) => response.json())
      .then((data) => {
        setMessages(
          data.map((item) => ({
            type: "message",
            username: item.username,
            message: item.message,
            time: item.time,
          }))
        );
      })
      .catch((error) => {
        console.error("Failed to load messages:", error);
      });
  }, []);

  // Socket.io events
  useEffect(() => {
    socket.on("online_users", (count) => {
      setOnlineUsers(count);
    });

    socket.on("receive_message", (data) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "message",
          username: data.username,
          message: data.message,
          time: data.time,
        },
      ]);
    });

    socket.on("system_message", (data) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: data.type,
          username: data.username,
          time: data.time,
        },
      ]);
    });

    return () => {
      socket.off("online_users");
      socket.off("receive_message");
      socket.off("system_message");
    };
  }, []);

  // Join chat
  const joinChat = () => {
    const name = username.trim();

    if (!name) {
      alert("Please enter your name before joining the chat.");
      return;
    }

    setUsername(name);
    setHasJoined(true);

    socket.emit("user_join", name);
  };

  // Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      username: username.trim(),
      message: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("send_message", newMessage);

    setMessage("");
  };

  return (
    <div className="app">
      <div className="chat-container">

        {/* Header */}
        <div className="chat-header">
          <div>
            <h1>Real-Time Chat</h1>

            <p>
              🟢 {onlineUsers} User
              {onlineUsers !== 1 ? "s" : ""} Online
            </p>
          </div>
        </div>

        {/* Username */}
        <div className="username-section">
          <label>Your Name</label>

          <div className="username-input">
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              disabled={hasJoined}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  joinChat();
                }
              }}
            />

            {!hasJoined && (
              <button onClick={joinChat}>
                Join
              </button>
            )}
          </div>

          {hasJoined && (
            <p className="joined-text">
              You joined the chat as <strong>{username}</strong>
            </p>
          )}
        </div>

        {/* Messages */}
        <div className="messages">
          {messages.length === 0 ? (
            <div className="empty-message">
              <div className="empty-icon">💬</div>

              <h3>No messages yet</h3>

              <p>Start the conversation!</p>
            </div>
          ) : (
            messages.map((item, index) => {

              // Join notification
              if (item.type === "join") {
                return (
                  <div
                    className="system-message join-notification"
                    key={index}
                  >
                    🟢 <strong>{item.username}</strong> joined the chat
                    <span>{item.time}</span>
                  </div>
                );
              }

              // Leave notification
              if (item.type === "leave") {
                return (
                  <div
                    className="system-message leave-notification"
                    key={index}
                  >
                    🔴 <strong>{item.username}</strong> left the chat
                    <span>{item.time}</span>
                  </div>
                );
              }

              // Normal message
              const isMine =
                item.username === username.trim();

              return (
                <div
                  className={`message-row ${
                    isMine
                      ? "my-message"
                      : "other-message"
                  }`}
                  key={index}
                >
                  <div className="message-bubble">

                    <div className="message-name">
                      {item.username}
                    </div>

                    <div className="message-text">
                      {item.message}
                    </div>

                    <div className="message-time">
                      {item.time}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input */}
        <div className="message-input">

          <input
            type="text"
            placeholder={
              hasJoined
                ? "Type a message..."
                : "Join the chat first..."
            }
            value={message}
            disabled={!hasJoined}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            disabled={!hasJoined}
          >
            Send
          </button>

        </div>

      </div>
    </div>
  );
}

export default App;