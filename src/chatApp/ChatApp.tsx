import React from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import { v4 as uuidv4 } from 'uuid';
import update from 'immutability-helper';
import parseISO from 'date-fns/parseISO'

import NchatApi from '../utils/NchatApi';
import Sidebar from './sidebar/Sidebar'
import ContentView from './contentView/ContentView'
import { User } from '../models/User';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { ConversationJson } from '../utils/json/ConversationJson';
import { MessageJson } from '../utils/json/MessageJson';
import { ChatAppContext } from './ChatAppContext';
import NchatWebSocket, { WSNotification, WSRequest }
  from '../utils/NchatWebSocket';

import styles from './ChatApp.module.css';

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
  logoutHandler: () => void,
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
    this.handleLaunchConversationCreator = this.handleLaunchConversationCreator.bind(this);
    this.handleConversationRowClick = this.handleConversationRowClick.bind(this);
    this.handleCreateConversation = this.handleCreateConversation.bind(this)
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  componentDidMount() {
    this.props.webSocket.addNotificationListener("newMessage", this.handleMessageReceived);
  }

  handleLaunchConversationCreator() {
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

      const retrievedMessages: Message[] = response.data.conversation.messages.map(message => {
        return {
          uuid: uuidv4(),
          id: message.id,
          senderId: message.senderId,
          body: message.body,
          sent: parseISO(message.sent),
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
      sent: parseISO(messageJson.sent),
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

  async handleCreateConversation(messageBody: string, conversationPartner: User) {
    const newConversation: Conversation = {
      uuid: uuidv4(),
      id: null,
      conversationPartner: conversationPartner,
      isHistoryLoaded: true,
      isLoading: false,
      messages: [],
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

    this.sendMessage(newConversation.uuid, messageBody);
  }

  async handleSendMessage(messageBody: string) {
    if (this.state.selectedConversationUuid === null) {
      return;
    }

    this.sendMessage(this.state.selectedConversationUuid, messageBody);
  }

  logoutHandler() {
    this.props.logoutHandler();
    navigate("/accounts/get-started");
  }

  private addMessageToConversation(conversations: Conversation[], index: number, message: Message):
    Conversation[] {
    const updatedConversation = update(conversations[index],
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

  private async sendMessage(conversationUuid: string, body: string) {
    const newMessage: Message = {
      uuid: uuidv4(),
      id: null,
      senderId: this.props.user.id,
      body: body,
      sent: new Date(),
    }

    this.setState((state, props) => {
      const conversationIndex = this.findConversationIndex(conversationUuid, state.conversations);
      const updatedConversations =
        this.addMessageToConversation(state.conversations, conversationIndex, newMessage);

      return {
        conversations: updatedConversations,
      }
    }, async () => {
      const conversation = this.findConversation(conversationUuid);
      if (conversation === null) {
        return;
      }

      const request: WSRequest<WSMessageRequestData> = {
        type: "request",
        method: "sendMessage",
        data: {
          username: conversation.conversationPartner.username,
          body: body,
        },
      };

      const response = await this.props.webSocket.sendRequest
        <WSMessageRequestData, WSMessageSuccessResponseData>(request);

      this.setState((state, props) => {
        const conversationIndex = this.findConversationIndex(conversationUuid, state.conversations);
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
                    $set: response.data.message.id,
                  },
                  sent: {
                    $set: parseISO(response.data.message.sent),
                  }
                },
              },
            },
          },
        );

        return {
          conversations: syncedConversations,
        };
      });
    });
  }

  private findConversationIndex(uuid: string | null, conversations?: Conversation[]): number {
    const toSearch = conversations ? conversations : this.state.conversations;
    if (uuid === null) {
      return -1;
    }
    return toSearch.findIndex(c => c.uuid === uuid);
  }

  private findConversation(uuid: string | null, conversations?: Conversation[]): Conversation | null {
    const toSearch = conversations ? conversations : this.state.conversations;
    if (uuid === null) {
      return null;
    }
    return toSearch.find(c => c.uuid === uuid) ?? null;
  }

  render() {
    const contextValue = {
      authKey: this.props.authKey,
      user: this.props.user,
    }

    const selectedConversation = this.findConversation(this.state.selectedConversationUuid);

    return (
      <div className={styles.main}>
        <ChatAppContext.Provider value={contextValue}>
          <Sidebar
            conversations={this.state.conversations}
            selectedConversationUuid={this.state.selectedConversationUuid}
            handleConversationRowClick={this.handleConversationRowClick}
            handleLaunchConversationCreator={this.handleLaunchConversationCreator}
            logoutHandler={this.logoutHandler} />
          <ContentView
            isConversationCreatorOpen={this.state.isConversationCreatorOpen}
            handleCreateConversation={this.handleCreateConversation}
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
