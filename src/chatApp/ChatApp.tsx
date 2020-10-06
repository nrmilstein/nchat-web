import React from 'react';
import { RouteComponentProps } from '@reach/router';

import NchatApi from '../utils/NchatApi';
import Sidebar from './sidebar/Sidebar'
import ContentView from './contentView/ContentView'
import User from '../models/User';
import Message from '../models/Message';
import ConversationStub from '../models/ConversationStub';
import Conversation from '../models/Conversation';
import { ChatAppContext } from './ChatAppContext';

import './ChatApp.css';

interface GetAuthenticateResponse {
  user: User,
}

interface GetConversationsResponse {
  conversations: Array<ConversationStub>;
}

interface GetConversationResponse {
  conversation: Conversation,
}

interface PostConversationsResponse {
  message: Message,
}

interface ChatAppProps extends RouteComponentProps {
  authKey: string,
  // The user given in props is immediately given to the state and requested from
  // the server if null.
  initialUser: User | null,
}

interface ChatAppState {
  user: User | null,
  conversationStubs: Array<ConversationStub> | null,
  conversation: Conversation | null,
}

class ChatApp extends React.Component<ChatAppProps, ChatAppState> {
  state: ChatAppState = {
    user: this.props.initialUser,
    conversationStubs: null,
    conversation: null,
  }

  constructor(props: ChatAppProps) {
    super(props);
    this.handleConversationStubClick = this.handleConversationStubClick.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  async componentDidMount() {
    if (this.state.user === null) {
      const user = await this.initUser();
      this.setState({
        "user": user,
      });
    };

    const conversations = await this.initConversations();

    this.setState({
      conversationStubs: conversations,
    });
  }

  async initUser(): Promise<User> {
    const response =
      await NchatApi.get<GetAuthenticateResponse>("authenticate", this.props.authKey);
    const user: User = {
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
    }
    return user;
  }

  async initConversations(): Promise<Array<ConversationStub>> {
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
    let conversation = response.data.conversation;
    conversation.users = conversation.users.filter(user => user.id !== this.state.user?.id);
    this.setState({
      conversation: conversation,
    });
  }

  async handleSend(messageBody: string): Promise<boolean> {
    if (this.state.conversation === null) {
      return false;
    }

    const authKey = this.props.authKey;
    const requestBody = {
      message: messageBody,
    };
    const response = await NchatApi.post<PostConversationsResponse>(
      "conversations/" + this.state.conversation.id,
      requestBody,
      authKey,
    );
    const newMessage = response.data.message;

    this.setState({
      conversation: {
        ...this.state.conversation,
        messages: [
          ...this.state.conversation.messages,
          newMessage,
        ],
      },
    });
    return true;
  }

  render() {
    const contextValue = {
      authKey: this.props.authKey,
      user: this.state.user,
    }
    return (
      <div className="ChatApp">
        <ChatAppContext.Provider value={contextValue}>
          <Sidebar
            conversationStubs={this.state.conversationStubs}
            handleConversationStubClick={this.handleConversationStubClick} />
          <ContentView handleSend={this.handleSend} conversation={this.state.conversation} />
        </ChatAppContext.Provider>
      </div>
    );
  }
}

export default ChatApp;
