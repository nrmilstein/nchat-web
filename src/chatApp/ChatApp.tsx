import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { v4 as uuidv4 } from 'uuid';

import NchatApi from '../utils/NchatApi';
import Sidebar from './sidebar/Sidebar'
import ContentView from './contentView/ContentView'
import { User } from '../models/User';
import { Conversation, ConversationStub } from '../models/Conversation';
import { Message } from '../models/Message';
import { ConversationJson } from '../utils/json/ConversationJson';
import { MessageJson } from '../utils/json/MessageJson';
import { ChatAppContext } from './ChatAppContext';
import NchatWebSocket, { WSNotification, WSRequest, WSSuccessResponse }
  from '../utils/NchatWebSocket';

import './ChatApp.css';

interface GetConversationResponse {
  conversation: ConversationJson,
}

interface WSMessageNotificationData {
  message: MessageJson,
  conversation: ConversationJson,
}

interface WSMessageRequestData {
  email: string,
  body: string,
}

interface WSMessageSuccessResponseData {
  message: MessageJson,
  conversation: ConversationJson,
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

    const conversationJson = response.data.conversation;

    const messages = conversationJson.messages.map(message => {
      return {
        ...message,
        uuid: uuidv4(),
      }
    });

    const conversation: Conversation = {
      uuid: uuidv4(),
      id: conversationJson.id,
      conversationStub: conversationStub,
      messages: messages,
      conversationPartner: conversationJson.conversationPartner,
    }

    this.setState({
      conversation: conversation,
    });
  }

  handleReceivedMessage(notification: WSNotification<WSMessageNotificationData>) {
    const data = notification.data
    if (data.conversation.id === this.state.conversation?.id) {
      const message = {
        uuid: uuidv4(),
        ...data.message,
      }
      this.addMessage(message);
    }
  }

  async handleSendMessage(messageBody: string): Promise<boolean> {
    if (this.state.conversation === null) {
      return false;
    }

    //TODO: add message before awaiting response
    const response = await this.sendMessage(
      this.state.conversation.conversationPartner.email, messageBody);

    const data = response.data;
    if (response.status === "success"
      && data.conversation.id === this.state.conversation?.id) {
      const message = {
        uuid: uuidv4(),
        ...data.message,
      }
      this.addMessage(message);
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
          <ContentView
            handleSendMessage={this.handleSendMessage}
            conversation={this.state.conversation} />
        </ChatAppContext.Provider>
      </div >
    );
  }

  componentWillUnmount() {
    this.props.webSocket.close();
  }
}

export default ChatApp;
