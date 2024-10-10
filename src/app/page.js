"use client"
import { useState } from 'react';
import GameSearch from '../components/GameSearch';
import Chat from '../components/Chat';

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="main-container">
      <div className="content-container">
        <GameSearch />
        <button onClick={() => setShowChat(!showChat)} className="toggle-chat-button">
          {showChat ? 'Hide Chat' : 'Show  Chat'}
        </button>
        {showChat && <Chat />}
      </div>
    </div>
  );
}
