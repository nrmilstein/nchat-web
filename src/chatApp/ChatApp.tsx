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
  selectedConversationUuid: string | null,
  isConversationCreatorOpen: boolean,
}

class ChatApp extends React.Component<ChatAppProps, ChatAppState> {
  state: ChatAppState = {
    conversations: this.props.conversations,
    selectedConversationUuid: null,
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
      selectedConversationUuid: null,
      isConversationCreatorOpen: true,
    });
  }

  async handleConversationRowClick(conversation: Conversation) {
    if (conversation.uuid === this.state.selectedConversationUuid) {
      return;
    }

    this.setState({
      isConversationCreatorOpen: false,
      selectedConversationUuid: conversation.uuid,
    });

    if (!conversation.isHistoryLoaded && !conversation.isLoading) {
      let conversationIndex = this.state.conversations.findIndex(c => c.uuid === conversation.uuid);
      const loadingConversations = update(this.state.conversations,
        {
          [conversationIndex]: {
            isLoading: {
              $set: true,
            },
          },
        },
      );

      this.setState({
        conversations: loadingConversations,
      });

      const response = await NchatApi.get<GetConversationResponse>(
        "conversations/" + conversation.id, this.props.authKey);

      const retrievedMessages = response.data.conversation.messages.map(message => {
        return {
          uuid: uuidv4(),
          id: message.id,
          senderId: message.senderId,
          body: message.body,
          sent: message.sent,
        }
      });

      conversationIndex = this.state.conversations.findIndex(c => c.uuid === conversation.uuid);
      const updatedConversations = update(this.state.conversations,
        {
          [conversationIndex]: {
            messages: {
              $set: retrievedMessages,
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

    const conversationIndex = this.state.conversations.findIndex(c => c.id === conversationJson.id);
    if (conversationIndex === -1) {
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
      const updatedConversations =
        this.addMessageToConversation(this.state.conversations, conversationIndex, newMessage);
      this.setState({
        conversations: updatedConversations,
      });
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
          selectedConversationUuid: newConversation.uuid,
          isConversationCreatorOpen: false,
        };
      });

      selectedConversation = newConversation;
    } else {
      if (this.state.selectedConversationUuid === null) {
        return;
      }

      const conversationIndex = this.state.conversations.findIndex(c => {
        return c.uuid === this.state.selectedConversationUuid
      });
      const updatedConversations =
        this.addMessageToConversation(this.state.conversations, conversationIndex, newMessage);

      this.setState({
        conversations: updatedConversations,
      });

      selectedConversation = updatedConversations[0];
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
      };
    });
  }

  private addMessageToConversation(conversations: Conversation[], index: number, message: Message):
    Conversation[] {
    const updatedConversation = update(this.state.conversations[index],
      {
        messages: {
          $push: [message],
        }
      }
    );
    const withRemovedConversation = update(conversations,
      {
        $splice: [[index, 1]]
      }
    );
    return [
      updatedConversation,
      ...withRemovedConversation,
    ]
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

    const selectedConversation = this.state.conversations
      .find(c => c.uuid === this.state.selectedConversationUuid) ?? null;

    return (
      <div className="ChatApp">
        <ChatAppContext.Provider value={contextValue}>
          <Sidebar
            conversations={this.state.conversations}
            selectedConversationUuid={this.state.selectedConversationUuid}
            handleConversationRowClick={this.handleConversationRowClick}
            handleNewConversation={this.handleNewConversation} />
          <ContentView
            isConversationCreatorOpen={this.state.isConversationCreatorOpen}
            handleSendMessage={this.handleSendMessage}
            selectedConversation={selectedConversation} />
        </ChatAppContext.Provider>
      </div >
    );
  }

  componentWillUnmount() {
    this.props.webSocket.close();
  }
}

export default ChatApp;
