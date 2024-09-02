// Chat.js
import React from 'react';
import Dashboard from '../Dashboard';
import { ChatBoxTemplate } from './chat-template'; // Correctly import as a named export

const Chat = () => {
  
  return (
    <div>
      <Dashboard />
      <ChatBoxTemplate />
    </div>
  );
};

export default Chat;
