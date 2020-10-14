import React from 'react';
import { RouteComponentProps } from '@reach/router';

import NchatApi from '../utils/NchatApi';
import Sidebar from './sidebar/Sidebar'
import ContentView from './contentView/ContentView'
import User from '../models/User';
import ConversationStub from '../models/ConversationStub';
import Conversation from '../models/Conversation';
import { ChatAppContext } from './ChatAppContext';

import './ChatApp.css';

interface GetConversationResponse {
  conversation: Conversation,
}

interface WSMessageResponse {
  id: number,
  conversationId: number,
  senderId: number,
  body: string,
  sent: Date,
}

interface ChatAppProps extends RouteComponentProps {
  authKey: string,
  user: User,
  conversationStubs: ConversationStub[],
  webSocket: WebSocket,
}

interface ChatAppState {
  conversationStubs: ConversationStub[],
  conversation: Conversation | null,
}

class ChatApp extends React.Component<ChatAppProps, ChatAppState> {
  state: ChatAppState = {
    conversationStubs: this.props.conversationStubs,
    conversation: null,
  }

  constructor(props: ChatAppProps) {
    super(props);
    this.handleConversationStubClick = this.handleConversationStubClick.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleReceivedMessage = this.handleReceivedMessage.bind(this);
  }

  async componentDidMount() {
    this.sendAuthMessage()
    this.props.webSocket.addEventListener("message", (event: MessageEvent) => {
      this.handleReceivedMessage(JSON.parse(event.data));
    });
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
    this.props.webSocket.send(JSON.stringify(authMessage));
  }

  async handleSendMessage(messageBody: string): Promise<boolean> {
    if (this.state.conversation === null) {
      return false;
    }

    const webSocketRequest = {
      email: this.state.conversation.conversationPartner.email,
      body: messageBody,
    };
    this.props.webSocket.send(JSON.stringify(webSocketRequest));

    // TODO: implement proper ACKs and immediate adding of message

    return true;
  }

  handleReceivedMessage(data: WSMessageResponse) {
    if (this.state.conversation === null) {
      return
    }
    if (data.conversationId === this.state.conversation?.id) {
      this.setState((prevState: ChatAppState, props: ChatAppProps) => {
        if (prevState.conversation === null) {
          return null;
        }
        return {
          conversation: {
            ...prevState.conversation,
            messages: [
              ...prevState.conversation.messages,
              data,
            ],
          },
        }
      });
    }
  }

  render() {
    const contextValue = {
      authKey: this.props.authKey,
      user: this.props.user,
    }
    return (
      <div className="ChatApp">
        <ChatAppContext.Provider value={contextValue}>
          <Sidebar
            conversationStubs={this.state.conversationStubs}
            handleConversationStubClick={this.handleConversationStubClick}
            conversation={this.state.conversation} />
          <main className="ChatApp__contentViewWrapper">
            {this.state.conversation !== null && <ContentView handleSendMessage={this.handleSendMessage}
              conversation={this.state.conversation} key={this.state.conversation?.id} />}
          </main>
        </ChatAppContext.Provider>
      </div>
    );
  }

  componentWillUnmount() {
    this.props.webSocket.close();
  }
}

export default ChatApp;
