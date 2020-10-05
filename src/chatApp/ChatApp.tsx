import React from 'react';
import { RouteComponentProps } from '@reach/router';

import NchatApi from '../utils/NchatApi';
import Sidebar from './sidebar/Sidebar'
import ContentView from './contentView/ContentView'
import User from '../models/User';
import ConversationStub from '../models/ConversationStub';
import Conversation from '../models/Conversation';

import './ChatApp.css';

interface ChatAppProps extends RouteComponentProps {
  authKey: string,
  // The user given in props is immediately given to the state and requested from
  // the server if null.
  initialUser: User | null,
}

interface ChatAppState {
  user: User | null,
  conversations: Array<ConversationStub> | null,
  conversation: Conversation | null,
}

interface GetAuthenticateResponse {
  user: User,
}

interface GetConversationsResponse {
  conversations: Array<ConversationStub>;
}

interface GetConversationResponse {
  conversation: Conversation,
}

class ChatApp extends React.Component<ChatAppProps, ChatAppState> {
  state: ChatAppState = {
    user: this.props.initialUser,
    conversations: null,
    conversation: null,
  }

  constructor(props: ChatAppProps) {
    super(props);
    this.handleConversationStubClick = this.handleConversationStubClick.bind(this);
  }

  async componentDidMount() {
    if (this.state.user === null) {
      const user = await this.requestUser();
      this.setState({
        "user": user,
      });
    };

    const conversations = await this.requestConversations();


    this.setState({
      conversations: conversations,
    });
  }

  async requestUser(): Promise<User> {
    const response =
      await NchatApi.get<GetAuthenticateResponse>("authenticate", this.props.authKey);
    const user: User = {
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
    }
    return user;
  }

  async requestConversations(): Promise<Array<ConversationStub>> {
    const response =
      await NchatApi.get<GetConversationsResponse>("conversations", this.props.authKey)
    const conversations = response.data.conversations;
    for (let conversation of conversations) {
      conversation.users = conversation.users.filter(user => user.id !== this.state.user?.id);
    }
    return conversations;
  }

  async handleConversationStubClick(conversationStub: ConversationStub) {
    const conversationId = conversationStub.id;
    const response = await NchatApi.get<GetConversationResponse>(
      "conversations/" + conversationId, this.props.authKey);
    const conversation = response.data.conversation;
    this.setState({
      conversation: conversation,
    });
  }

  render() {
    return (
      <div className="ChatApp">
        <Sidebar
          user={this.state.user}
          conversations={this.state.conversations}
          handleConversationStubClick={this.handleConversationStubClick} />
        <ContentView conversation={this.state.conversation} />
      </div>
    );
  }
}

export default ChatApp;
