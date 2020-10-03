import React from 'react';

import { RouteComponentProps } from '@reach/router';

import Sidebar from './sidebar/Sidebar'
import ConversationView from './conversationView/ConversationView'

import './ChatApp.css';

function ChatApp(props: RouteComponentProps) {
  return (
    <div className="ChatApp">
      <Sidebar />
      <ConversationView />
    </div>
  );
}

export default ChatApp;
