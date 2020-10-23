import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { v4 as uuidv4 } from 'uuid';

import NchatApi from '../utils/NchatApi';
import Sidebar from './sidebar/Sidebar'
import ContentView from './contentView/ContentView'
import { SyncedUser } from '../models/User';
import { SyncedConversation, ConversationStub, Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { ConversationJson } from '../utils/json/ConversationJson';
import { MessageJson } from '../utils/json/MessageJson';
import { ChatAppContext } from './ChatAppContext';
import NchatWebSocket, { WSNotification, WSRequest, WSSuccessResponse }
  from '../utils/NchatWebSocket';

import './ChatApp.css';
import ConversationView from './contentView/ConversationView';

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
  user: SyncedUser,
  conversationStubs: ConversationStub[],
  webSocket: NchatWebSocket,
}

interface ChatAppState {
  conversationStubs: ConversationStub[],
  selectedConversationStub: ConversationStub | null,
  conversation: Conversation | null,
}

class ChatApp extends React.Component<ChatAppProps, ChatAppState> {
  state: ChatAppState = {
    selectedConversationStub: null,
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
    const newConversation: Conversation = {
      uuid: uuidv4(),
      id: null,
      conversationPartner: {
        id: null,
        email: null,
        name: null,
      },
      messages: [],
      isEditable: true,
    };
    this.setState({
      selectedConversationStub: null,
      conversation: newConversation,
    });
  }

  async handleConversationStubClick(conversationStub: ConversationStub) {
    if (conversationStub.uuid === this.state.selectedConversationStub?.uuid) {
      return;
    }

    this.setState({
      selectedConversationStub: conversationStub,
    })

    const response = await NchatApi.get<GetConversationResponse>(
      "conversations/" + conversationStub.id, this.props.authKey);
    const conversationJson = response.data.conversation;

    const messages = conversationJson.messages.map(message => {
      return {
        ...message,
        uuid: uuidv4(),
      }
    });

    const conversation: SyncedConversation = {
      isEditable: false,
      uuid: uuidv4(),
      id: conversationJson.id,
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

  async handleSendMessage(messageBody: string, conversation: Conversation): Promise<boolean> {
    if (conversation.conversationPartner.email === null) {
      return false;
    }

    let newMessage: Message = {
      uuid: uuidv4(),
      id: null,
      senderId: this.props.user.id,
      body: messageBody,
      sent: null,
    }

    if (conversation.uuid === this.state.conversation?.uuid) {
      this.addMessage(newMessage);
    }

    const response = await this.sendMessage(
      conversation.conversationPartner.email, messageBody);

    const data = response.data;
    if (response.status === "success" && conversation.isEditable) {
      const responseConversation = data.conversation;
      const newConversation: SyncedConversation = {
        ...conversation,
        id: responseConversation.id,
        isEditable: false,
        conversationPartner: responseConversation.conversationPartner,
      }
      const newConversationStub: ConversationStub = {
        uuid: uuidv4(),
        id: newConversation.id,
        conversationPartner: newConversation.conversationPartner,
      }
      const newconversationStubs = [
        newConversationStub,
        ...this.state.conversationStubs,
      ]

      this.setState({
        conversationStubs: newconversationStubs,
        conversation: newConversation,
      });
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
            conversationStubs={this.state.conversationStubs}
            selectedConversationStub={this.state.selectedConversationStub}
            handleConversationStubClick={this.handleConversationStubClick}
            handleNewConversation={this.handleNewConversation} />
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
