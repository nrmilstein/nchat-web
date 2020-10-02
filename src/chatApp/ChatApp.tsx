import React from 'react';

import Sidebar from './sidebar/Sidebar'
import ConversationView from './conversationView/ConversationView'

import './ChatApp.css';

function ChatApp() {
  return (
    <div className="ChatApp">
      <Sidebar />
      <ConversationView />
    </div>
  );
}

export default ChatApp;
