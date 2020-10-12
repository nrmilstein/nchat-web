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

interface WSMessageFromServer {
  senderId: number,
  body: string,
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

  webSocket: WebSocket | null = null;

  constructor(props: ChatAppProps) {
    super(props);
    this.handleConversationStubClick = this.handleConversationStubClick.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleReceivedMessage = this.handleReceivedMessage.bind(this);
  }

  async componentDidMount() {
    this.webSocket = this.initWebSocket();

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

  initWebSocket(): WebSocket {
    const webSocket = new WebSocket("ws://localhost:3000/api/v1/chat", "nchat");
    webSocket.addEventListener("open", (event: Event) => {
      this.sendAuthMessage()
      webSocket?.addEventListener("message", (event: MessageEvent) => {
        this.handleReceivedMessage(JSON.parse(event.data));
      });
    })
    return webSocket;
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
  }

  sendAuthMessage() {
    const authMessage = {
      authKey: this.props.authKey,
    };
    this.webSocket?.send(JSON.stringify(authMessage));
  }

  async handleSendMessage(messageBody: string): Promise<boolean> {
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
    const sentMessage = response.data.message;

    const webSocketMessage = {
      receiverId: this.state.conversation.conversationPartner.id,
      body: messageBody,
    };
    this.webSocket?.send(JSON.stringify(webSocketMessage));

    this.setState((prevState: ChatAppState, props: ChatAppProps) => {
      if (prevState.conversation === null) {
        return null;
      }
      return {
        conversation: {
          ...prevState.conversation,
          messages: [
            ...prevState.conversation.messages,
            sentMessage,
          ],
        },
      };
    });

    return true;
  }

  handleReceivedMessage(data: WSMessageFromServer) {
    if (this.state.conversation === null) {
      return
    }
    const receivedMessage = {
      id: this.state.conversation.messages[this.state.conversation.messages.length - 1].id + 1,
      senderId: data.senderId,
      body: data.body,
      sent: new Date(),
    };
    if (data.senderId === this.state.conversation?.conversationPartner.id) {
      this.setState((prevState: ChatAppState, props: ChatAppProps) => {
        if (prevState.conversation === null) {
          return null;
        }
        return {
          conversation: {
            ...prevState.conversation,
            messages: [
              ...prevState.conversation.messages,
              receivedMessage,
            ],
          },
        }
      });
    }
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
          <ContentView handleSendMessage={this.handleSendMessage}
            conversation={this.state.conversation} key={this.state.conversation?.id} />
        </ChatAppContext.Provider>
      </div>
    );
  }

  componentWillUnmount() {
    this.webSocket?.close();
  }
}

export default ChatApp;
