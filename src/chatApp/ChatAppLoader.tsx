import React from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import { v4 as uuidv4 } from 'uuid';
import parseISO from 'date-fns/parseISO'

import ChatApp from './ChatApp';
import { Conversation } from '../models/Conversation';
import { ConversationJson } from '../utils/json/ConversationJson';
import { User } from '../models/User';
import { UserJson } from '../utils/json/UserJson';
import NchatApi, { FetchError } from '../utils/NchatApi';
import NchatWebSocket, { WSRequest, WSSuccessResponse } from '../utils/NchatWebSocket';

import "./ChatAppLoader.css";
import "../assets/LoadingIcon.css";

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
  authKey: string | null,
  user: User | null,
  logoutHandler: () => void;
}

interface ChatAppLoaderState {
  user: User | null,
  conversations: Conversation[] | null,
  webSocket: NchatWebSocket | null,
  errorMessage: string | null;
}

class ChatAppLoader extends React.Component<ChatAppLoaderProps, ChatAppLoaderState> {
  state: ChatAppLoaderState = {
    user: this.props.user,
    conversations: null,
    webSocket: null,
    errorMessage: null,
  }

  async componentDidMount() {
    if (this.props.authKey === null) {
      // There is an acknowledged bug where navigate does not work in componentDidMount. This
      // hack is a workaround.
      setTimeout(() => navigate('/accounts/get-started'), 1);
      return;
    }

    const authKey = this.props.authKey;

    try {
      const userPromise = this.state.user === null
        ? this.initUser(authKey)
        : Promise.resolve(this.state.user);

      const conversationsPromise = this.initConversations(authKey);

      const webSocketPromise = NchatWebSocket.createWebSocket()
        .then(webSocket => {
          this.sendAuth(authKey, webSocket);
          return webSocket;
        });

      const [user, conversations, webSocket] =
        await Promise.all([userPromise, conversationsPromise, webSocketPromise]);

      this.setState({
        user: user,
        conversations: conversations,
        webSocket: webSocket,
      });
    } catch (error) {
      if (error instanceof FetchError && error.response.status === 403) {
        this.props.logoutHandler();
      } else {
        this.setState({
          errorMessage: "Could not load nchat. Please try again later.",
        });
      }
    }
  }

  async initUser(authKey: string): Promise<User> {
    const response =
      await NchatApi.get<GetAuthenticateResponse>("authenticate", authKey);
    const user: User = {
      id: response.data.user.id,
      name: response.data.user.name,
      username: response.data.user.username,
    }
    return user;
  }

  async initConversations(authKey: string): Promise<Conversation[]> {
    const response =
      await NchatApi.get<GetConversationsResponse>("conversations", authKey);

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

  private sendAuth(authKey: string, webSocket: NchatWebSocket):
    Promise<WSSuccessResponse<WSAuthResponseData>> {
    const request: WSRequest<WSAuthRequestData> = {
      type: "request",
      method: "authorize",
      data: {
        authKey: authKey,
      },
    };

    return webSocket.sendRequest(request);
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div className="ChatAppLoader">
        {
          this.state.user && this.state.conversations && this.state.webSocket && this.props.authKey
            ?
            <ChatApp
              authKey={this.props.authKey}
              user={this.state.user}
              webSocket={this.state.webSocket}
              conversations={this.state.conversations}
              logoutHandler={this.props.logoutHandler} />
            :
            <div className="ChatAppLoader__loading">
              {this.state.errorMessage === null
                ? <div className="ChatAppLoader__loadingIcon LoadingIcon"></div>
                : <div className="ChatAppLoader__errorMessage">{this.state.errorMessage}</div>
              }
            </div>
        }
      </div>
    );
  }
}

export default ChatAppLoader