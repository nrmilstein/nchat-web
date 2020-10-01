import React from 'react';

import MainContentHeader from './MainContentHeader';
import Conversation from './Conversation';
import MessageInput from './MessageInput';

import "./MainContent.css"

function MainContent() {
  return (
    <main className="MainContent">
      <MainContentHeader />
      <Conversation />
      <MessageInput />
    </main>
  );
}

export default MainContent;