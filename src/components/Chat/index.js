"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { fetchBetSlipInfo, fetchGameInfo } from "../../api/chat.api";
import {
  betSlipRegex,
  gameUrlRegex,
  taggedUserRegex,
} from "../../utils/constants";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [dropdownUser, setDropdownUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [gameInfo, setGameInfo] = useState(null);
  const [betSlipInfo, setBetSlipInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const gameData = await fetchGameInfo("heroic-spins-pragmatic");
        setGameInfo(gameData);
      } catch {
        setError("Failed to load game info.");
      }

      try {
        const betSlipData = await fetchBetSlipInfo("13258619");
        setBetSlipInfo(betSlipData);
      } catch {
        setError("Failed to load bet slip info.");
      }
    };

    fetchInitialData();
  }, []);

  const handleSendMessage = () => {
    if (!canSendMessage || !message) return;

    const taggedUserMatch = message.match(taggedUserRegex);
    const gameUrlMatch = message.match(gameUrlRegex);
    const betSlipMatch = message.match(betSlipRegex);

    const newMessage = {
      id: uuidv4(),
      text: message,
      taggedUser: taggedUserMatch ? taggedUserMatch[0] : null,
      gameLink: gameUrlMatch ? gameUrlMatch[0] : null,
      betSlipLink: betSlipMatch ? betSlipMatch[0] : null,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
    setCanSendMessage(false);

    setTimeout(() => {
      setCanSendMessage(true);
    }, 10000);
  };

  const handleUserHover = (messageId) => {
    setDropdownUser(messageId);
    setShowDropdown(true);
  };

  const handleUserLeave = () => {
    setShowDropdown(false);
    setDropdownUser(null);
  };

  const handleDropdownOptionClick = (option) => {
    console.info(`Option clicked: ${option} for user ${dropdownUser}`);
    setShowDropdown(false);
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">Chat Room</h2>
      <h4>Type a message or tag a user or send game or bet link to see embedded video</h4>
      <div className="message-list">
        {messages.map((msg, index) => {
          if (msg.gameLink) {
            return (
              <iframe
                key={index}
                height={800}
                src={msg.gameLink}
                title={msg.gameLink}
                className="game-iframe"
              />
            );
          }
          if (msg.betSlipLink) {
            return (
              <iframe
                key={index}
                height={800}
                src={msg.betSlipLink}
                title={msg.betSlipLink}
                className="bet-slip-iframe"
              />
            );
          }
          return (
            <div key={index} className={`message ${msg.taggedUser ? "tagged" : ""}`}>
              <p>
                {msg.text.split(" ").map((word, i) => {
                  if (word.startsWith("@")) {
                    return (
                      <span
                        key={i}
                        className="tagged-user"
                        onMouseEnter={() => handleUserHover(msg.id)} // Show dropdown on hover
                        onMouseLeave={handleUserLeave} // Hide dropdown on mouse leave
                      >
                        {word}
                      </span>
                    );
                  }
                  return word + " ";
                })}
              </p>

              {showDropdown && dropdownUser === msg.id && (
                <div className="dropdown-menu">
                  <ul>
                    <li onClick={() => handleDropdownOptionClick("View Profile")}>View Profile</li>
                    <li onClick={() => handleDropdownOptionClick("Send Message")}>Send Message</li>
                    <li onClick={() => handleDropdownOptionClick("Block User")}>Block User</li>
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button
          onClick={handleSendMessage}
          disabled={!canSendMessage}
          className="send-button"
        >
          Send
        </button>
      </div>
      {!canSendMessage && (
        <p className="rate-limit-message">
          You can only send one message every 10 seconds.
        </p>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
