import React from 'react';
// import { navigate } from "@reach/router";
import { RouteComponentProps } from '@reach/router';

import Sidebar from './sidebar/Sidebar'
import ConversationView from './conversationView/ConversationView'
import User from '../models/User';

import './ChatApp.css';

interface ChatAppProps extends RouteComponentProps {
  user: User,
  authKey: string,
}

class ChatApp extends React.Component<ChatAppProps, {}> {
  render() {
    return (
      <div className="ChatApp">
        <Sidebar user={this.props.user} />
        <ConversationView />
      </div>
    );
  }
}

export default ChatApp;
