import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { v4 as uuidv4 } from 'uuid';
import update from 'immutability-helper';

import NchatApi from '../utils/NchatApi';
import Sidebar from './sidebar/Sidebar'
import ContentView from './contentView/ContentView'
import { User } from '../models/User';
import { Conversation } from '../models/Conversation';
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
  username: string,
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
  conversations: Conversation[],
  webSocket: NchatWebSocket,
}

interface ChatAppState {
  conversations: Conversation[],
  selectedConversation: Conversation | null,
  isConversationCreatorOpen: boolean,
}

class ChatApp extends React.Component<ChatAppProps, ChatAppState> {
  state: ChatAppState = {
    conversations: this.props.conversations,
    selectedConversation: null,
    isConversationCreatorOpen: false,
  }

  constructor(props: ChatAppProps) {
    super(props);
    this.handleMessageReceived = this.handleMessageReceived.bind(this);
    this.handleNewConversation = this.handleNewConversation.bind(this);
    this.handleConversationRowClick = this.handleConversationRowClick.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  componentDidMount() {
    this.props.webSocket.addNotificationListener("newMessage", this.handleMessageReceived);
  }

  handleNewConversation() {
    this.setState({
      selectedConversation: null,
      isConversationCreatorOpen: true,
    });
  }

  async handleConversationRowClick(conversation: Conversation) {
    if (conversation.uuid === this.state.selectedConversation?.uuid) {
      return;
    }

    this.setState({
      isConversationCreatorOpen: false,
    });

    if (!conversation.isHistoryLoaded && !conversation.isLoading) {
      let index = this.state.conversations.findIndex(c => c.uuid === conversation.uuid);
      const loadingConversations = update(this.state.conversations,
        {
          [index]: {
            isLoading: {
              $set: true,
            },
          },
        },
      );

      this.setState({
        conversations: loadingConversations,
        selectedConversation: loadingConversations[index],
      });

      const response = await NchatApi.get<GetConversationResponse>(
        "conversations/" + conversation.id, this.props.authKey);
      const newMessages = response.data.conversation.messages.map(message => {
        return {
          uuid: uuidv4(),
          id: message.id,
          senderId: message.senderId,
          body: message.body,
          sent: message.sent,
        }
      });

      index = this.state.conversations.findIndex(c => c.uuid === conversation.uuid);
      const updatedConversations = update(this.state.conversations,
        {
          [index]: {
            messages: {
              $set: newMessages,
            },
            isLoading: {
              $set: false,
            },
            isHistoryLoaded: {
              $set: true,
            }
          }
        },
      );

      this.setState({
        conversations: updatedConversations,
        selectedConversation: updatedConversations[index],
      });
    } else {
      this.setState({
        selectedConversation: conversation,
      });
    }
  }

  handleMessageReceived(notification: WSNotification<WSMessageNotificationData>) {
    const messageJson = notification.data.message;
    const conversationJson = notification.data.conversation;

    const newMessage: Message = {
      uuid: uuidv4(),
      id: messageJson.id,
      body: messageJson.body,
      senderId: messageJson.senderId,
      sent: messageJson.sent,
    };

    const index = this.state.conversations.findIndex(c => c.id === conversationJson.id);
    if (index === -1) {
      const newConversation: Conversation = {
        uuid: uuidv4(),
        id: conversationJson.id,
        conversationPartner: {
          id: conversationJson.conversationPartner.id,
          username: conversationJson.conversationPartner.username,
          name: conversationJson.conversationPartner.name,
        },
        messages: [newMessage],
        isHistoryLoaded: true,
        isLoading: false,
      };
      const updatedConversations = [
        newConversation,
        ...this.state.conversations,
      ];
      this.setState({
        conversations: updatedConversations,
      });
    } else {
      const updatedConversations = update(this.state.conversations,
        {
          [index]: {
            messages: {
              $push: [newMessage]
            },
          },
        },
      );
      this.setState({
        conversations: updatedConversations,
      });
      if (this.state.selectedConversation?.uuid === updatedConversations[index].uuid) {
        this.setState({
          selectedConversation: updatedConversations[index],
        });
      };
    }
  }

  async handleSendMessage(messageBody: string, conversationPartner?: User) {
    const newMessage: Message = {
      uuid: uuidv4(),
      id: null,
      senderId: this.props.user.id,
      body: messageBody,
      sent: null,
    }

    let selectedConversation: Conversation | null;

    if (this.state.isConversationCreatorOpen && conversationPartner) {
      const newConversation: Conversation = {
        uuid: uuidv4(),
        id: null,
        conversationPartner: conversationPartner,
        isHistoryLoaded: true,
        isLoading: false,
        messages: [newMessage],
      };

      this.setState((state, props) => {
        const updatedConversations = [
          newConversation,
          ...state.conversations,
        ];
        return {
          conversations: updatedConversations,
          selectedConversation: newConversation,
          isConversationCreatorOpen: false,
        };
      });

      selectedConversation = newConversation;
    } else {
      selectedConversation = this.state.selectedConversation;

      if (selectedConversation === null) {
        return;
      }

      const conversationIndex = this.state.conversations.findIndex(c => {
        return c.uuid === selectedConversation?.uuid
      });
      const updatedConversations = update(this.state.conversations,
        {
          [conversationIndex]: {
            messages: {
              $push: [newMessage],
            },
          },
        },
      );

      this.setState({
        conversations: updatedConversations,
        selectedConversation: updatedConversations[conversationIndex],
      });
    }

    const response = await this.sendMessage(
      selectedConversation.conversationPartner.username, messageBody);


    this.setState((state, props) => {
      const conversationIndex = state.conversations.findIndex(c => {
        return c.uuid === selectedConversation?.uuid
      });
      const messageIndex = state.conversations[conversationIndex].messages.findIndex(m => {
        return m.uuid === newMessage.uuid;
      });

      const syncedConversations = update(state.conversations,
        {
          [conversationIndex]: {
            id: {
              $set: response.data.conversation.id,
            },
            messages: {
              [messageIndex]: {
                id: {
                  $set: response.data.message.id
                },
              },
            },
          },
        },
      );

      return {
        conversations: syncedConversations,
        selectedConversation: syncedConversations[conversationIndex],
      };
    });
  }

  private sendMessage(username: string, body: string):
    Promise<WSSuccessResponse<WSMessageSuccessResponseData>> {
    const request: WSRequest<WSMessageRequestData> = {
      type: "request",
      method: "sendMessage",
      data: {
        username: username,
        body: body,
      },
    };
    return this.props.webSocket.sendRequest(request);
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
            conversations={this.state.conversations}
            selectedConversation={this.state.selectedConversation}
            handleConversationRowClick={this.handleConversationRowClick}
            handleNewConversation={this.handleNewConversation} />
          <ContentView
            isConversationCreatorOpen={this.state.isConversationCreatorOpen}
            handleSendMessage={this.handleSendMessage}
            selectedConversation={this.state.selectedConversation} />
        </ChatAppContext.Provider>
      </div >
    );
  }

  componentWillUnmount() {
    this.props.webSocket.close();
  }
}

export default ChatApp;
