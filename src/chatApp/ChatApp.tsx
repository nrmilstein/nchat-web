import React from 'react';
// import { navigate } from "@reach/router";
import { RouteComponentProps } from '@reach/router';

import Sidebar from './sidebar/Sidebar'
import ConversationView from './conversationView/ConversationView'
import User from '../models/User';

import './ChatApp.css';
import NchatApi from '../utils/NchatApi';

interface ChatAppProps extends RouteComponentProps {
  authKey: string,
  user: User | null,
}

interface ChatAppState {
  user: User | null,
}

class ChatApp extends React.Component<ChatAppProps, ChatAppState> {
  state: ChatAppState = {
    user: this.props.user,
  }

  async componentDidMount() {
    if (this.state.user === null) {
      const response = await NchatApi.get("authenticate", this.props.authKey);
      const user: User = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
      }
      this.setState({
        "user": user,
      });
    }
  }

  render() {
    return (
      <div className="ChatApp">
        <Sidebar user={this.state.user} />
        <ConversationView />
      </div>
    );
  }
}

export default ChatApp;
