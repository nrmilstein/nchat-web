import React from 'react';

import ConversationViewBanner from './ConversationViewBanner';
import Conversation from './Conversation';
import MessageInput from './MessageInput';

import "./ConversationView.css"

function ConversationView() {
  return (
    <main className="ConversationView">
      <ConversationViewBanner />
      <Conversation />
      <MessageInput />
    </main>
  );
}

export default ConversationView;