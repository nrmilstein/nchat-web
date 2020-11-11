import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { v4 as uuidv4 } from 'uuid';
import parseISO from 'date-fns/parseISO'

import ChatApp from './ChatApp';
import { Conversation } from '../models/Conversation';
import { ConversationJson } from '../utils/json/ConversationJson';
import { User } from '../models/User';
import { UserJson } from '../utils/json/UserJson';
import NchatApi from '../utils/NchatApi';
import NchatWebSocket, { WSRequest, WSSuccessResponse } from '../utils/NchatWebSocket';

import "./ChatAppLoader.css";
import "../misc/LoadingIcon.css";

interface GetAuthenticateResponse {
  user: UserJson,
}

interface GetConversationsResponse {
  conversations: ConversationJson[];
}

interface WSAuthRequestData {
  authKey: string,
}

interface WSAuthResponseData {
}

interface ChatAppLoaderProps extends RouteComponentProps {
  authKey: string,
  user: User | null,
}

interface ChatAppLoaderState {
  user: User | null,
  conversations: Conversation[] | null,
  webSocket: NchatWebSocket | null,
}

class ChatAppLoader extends React.Component<ChatAppLoaderProps, ChatAppLoaderState> {
  state: ChatAppLoaderState = {
    user: this.props.user,
    conversations: null,
    webSocket: null,
  }

  async componentDidMount() {
    const userPromise = this.state.user === null
      ? Promise.resolve(this.state.user)
      : this.initUser();
    const conversationsPromise = this.initConversations();

    const webSocket = await NchatWebSocket.createWebSocket();
    const authResponse = await this.sendAuth(webSocket);
    if (authResponse.status !== "success") {
      throw new Error("Could not connect to webSocket.")
    }

    const [user, conversations] = await Promise.all([userPromise, conversationsPromise]);

    this.setState({
      user: user,
      conversations: conversations,
      webSocket: webSocket,
    })
  }

  async initUser(): Promise<User> {
    const response =
      await NchatApi.get<GetAuthenticateResponse>("authenticate", this.props.authKey);
    const user: User = {
      id: response.data.user.id,
      name: response.data.user.name,
      username: response.data.user.username,
    }
    return user;
  }

  async initConversations(): Promise<Conversation[]> {
    const response =
      await NchatApi.get<GetConversationsResponse>("conversations", this.props.authKey);

    const conversations = response.data.conversations.map(conversation => {
      return {
        uuid: uuidv4(),
        id: conversation.id,
        conversationPartner: {
          id: conversation.conversationPartner.id,
          username: conversation.conversationPartner.username,
          name: conversation.conversationPartner.name,
        },
        messages: conversation.messages.map(message => {
          return {
            uuid: uuidv4(),
            id: message.id,
            senderId: message.senderId,
            body: message.body,
            sent: parseISO(message.sent),
          };
        }),
        isHistoryLoaded: false,
        isLoading: false,
      };
    });
    return conversations;
  }

  private sendAuth(webSocket: NchatWebSocket):
    Promise<WSSuccessResponse<WSAuthResponseData>> {
    const request: WSRequest<WSAuthRequestData> = {
      type: "request",
      method: "authorize",
      data: {
        authKey: this.props.authKey,
      },
    };

    return webSocket.sendRequest(request);
  }

  render() {
    return (
      <div className="ChatAppLoader">
        {
          this.state.user && this.state.conversations && this.state.webSocket
            ?
            <ChatApp
              authKey={this.props.authKey}
              user={this.state.user}
              webSocket={this.state.webSocket}
              conversations={this.state.conversations} />
            :
            <div className="ChatAppLoader__loading">
              <div className="ChatAppLoader__loadingIcon LoadingIcon"></div>
            </div>
        }
      </div>
    );
  }
}

export default ChatAppLoader