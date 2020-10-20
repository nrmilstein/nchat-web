import React from 'react';
import { RouteComponentProps } from '@reach/router';

import NchatApi from '../utils/NchatApi';
import Sidebar from './sidebar/Sidebar'
import ContentView from './contentView/ContentView'
import User from '../models/User';
import Conversation, { ConversationStub } from '../models/Conversation';
import { ChatAppContext } from './ChatAppContext';
import NchatWebSocket, { WSNotification, WSRequest, WSSuccessResponse } from '../utils/NchatWebSocket';
import Message, { MessageNode } from '../models/Message';

import './ChatApp.css';

interface GetConversationResponse {
  conversation: Conversation,
}

interface WSMessageNotificationData {
  message: MessageNode,
}

interface WSMessageRequestData {
  email: string,
  body: string,
}

interface WSMessageSuccessResponseData {
  message: MessageNode,
}

interface WSMessageErrorResponseData {
}

interface ChatAppProps extends RouteComponentProps {
  authKey: string,
  user: User,
  conversationStubs: ConversationStub[],
  webSocket: NchatWebSocket,
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
    this.handleReceivedMessage = this.handleReceivedMessage.bind(this);
    this.handleNewConversation = this.handleNewConversation.bind(this);
    this.handleConversationStubClick = this.handleConversationStubClick.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  componentDidMount() {
    this.props.webSocket.addNotificationListener("newMessage", this.handleReceivedMessage);
  }

  handleNewConversation() {

  }

  async handleConversationStubClick(conversationStub: ConversationStub) {
    const response = await NchatApi.get<GetConversationResponse>(
      "conversations/" + conversationStub.id, this.props.authKey);
    let conversation = response.data.conversation;
    this.setState({
      conversation: conversation,
    });
  }

  handleReceivedMessage(notification: WSNotification<WSMessageNotificationData>) {
    const message = notification.data.message;
    if (message.conversationId === this.state.conversation?.id) {
      this.addMessage(notification.data.message);
    }
  }

  async handleSendMessage(messageBody: string): Promise<boolean> {
    if (this.state.conversation === null) {
      return false;
    }

    const response = await this.sendMessage(
      this.state.conversation.conversationPartner.email, messageBody);


    const data = response.data;
    if (response.status === "success"
      && data.message.conversationId === this.state.conversation?.id) {
      this.addMessage(data.message);
    }

    return true;
  }

  private sendMessage(email: string, body: string):
    Promise<WSSuccessResponse<WSMessageSuccessResponseData>> {
    const request: WSRequest<WSMessageRequestData> = {
      type: "request",
      method: "sendMessage",
      data: {
        email: email,
        body: body,
      },
    };
    return this.props.webSocket.sendRequest(request);
  }

  addMessage(message: Message) {
    this.setState((prevState: ChatAppState, props: ChatAppProps) => {
      if (prevState.conversation === null) {
        return null;
      }
      return {
        conversation: {
          ...prevState.conversation,
          messages: [
            ...prevState.conversation.messages,
            message,
          ],
        },
      };
    });
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
            handleNewConversation={this.handleNewConversation}
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
