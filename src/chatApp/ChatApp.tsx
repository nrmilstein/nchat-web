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
  conversations: ConversationStub[];
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

  private scrollToBottomHandler = () => { };

  constructor(props: ChatAppProps) {
    super(props);
    this.handleConversationStubClick = this.handleConversationStubClick.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.setScrollToBottomHandler = this.setScrollToBottomHandler.bind(this);
  }

  async componentDidMount() {
    if (this.state.user === null) {
      const user = await this.initUser();
      this.setState({
        "user": user,
      });
    };

    const conversationStubs = await this.initConversationStubs();

    this.setState({
      conversationStubs: conversationStubs,
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

  async initConversationStubs(): Promise<ConversationStub[]> {
    const response =
      await NchatApi.get<GetConversationsResponse>("conversations", this.props.authKey);
    const conversationStubs = response.data.conversations;
    return conversationStubs;
  }

  async handleConversationStubClick(conversationStub: ConversationStub) {
    const response = await NchatApi.get<GetConversationResponse>(
      "conversations/" + conversationStub.id, this.props.authKey);
    let conversation = response.data.conversation;
    this.setState({
      conversation: conversation,
    });
    this.scrollToBottomHandler();
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
    const addedMessage = response.data.message;

    this.setState({
      conversation: {
        ...this.state.conversation,
        messages: [
          ...this.state.conversation.messages,
          addedMessage,
        ],
      },
    });

    this.scrollToBottomHandler();

    return true;
  }

  setScrollToBottomHandler(scrollToBottomHandler: () => void) {
    this.scrollToBottomHandler = scrollToBottomHandler;
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
          <ContentView handleSend={this.handleSend}
            setScrollToBottomHandler={this.setScrollToBottomHandler}
            conversation={this.state.conversation} />
        </ChatAppContext.Provider>
      </div>
    );
  }
}

export default ChatApp;
