import React from 'react';
import { RouteComponentProps } from '@reach/router';

import ChatApp from './ChatApp';
import { ConversationStub } from '../models/Conversation';
import User from '../models/User';
import NchatApi from '../utils/NchatApi';
import NchatWebSocket, { WSRequest, WSSuccessResponse } from '../utils/NchatWebSocket';

import "./ChatAppLoader.css";

interface GetAuthenticateResponse {
  user: User,
}

interface GetConversationStubsResponse {
  conversations: ConversationStub[];
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
  conversationStubs: ConversationStub[] | null,
  webSocket: NchatWebSocket | null,
}

class ChatAppLoader extends React.Component<ChatAppLoaderProps, ChatAppLoaderState> {
  state: ChatAppLoaderState = {
    user: this.props.user,
    conversationStubs: null,
    webSocket: null,
  }

  async componentDidMount() {
    const userPromise = this.state.user === null
      ? Promise.resolve(this.state.user)
      : this.initUser();
    const conversationStubsPromise = this.initConversationStubs();

    const webSocket = await NchatWebSocket.createWebSocket();
    const authResponse = await this.sendAuth(webSocket);
    if (authResponse.status !== "success") {
      throw new Error("Could not connect to webSocket.")
    }

    const [user, conversationStubs] = await Promise.all([userPromise, conversationStubsPromise]);

    this.setState({
      user: user,
      conversationStubs: conversationStubs,
      webSocket: webSocket,
    })
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
      await NchatApi.get<GetConversationStubsResponse>("conversations", this.props.authKey);
    const conversationStubs = response.data.conversations;
    return conversationStubs;
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
          this.state.user && this.state.conversationStubs && this.state.webSocket
            ?
            <ChatApp authKey={this.props.authKey} user={this.state.user}
              webSocket={this.state.webSocket} conversationStubs={this.state.conversationStubs} />
            :
            <div className="ChatAppLoader__loading">
              <div className="ChatAppLoader__loadingIcon">
              </div>
            </div>
        }
      </div>
    );
  }
}

export default ChatAppLoader