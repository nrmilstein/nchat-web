import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { v4 as uuidv4 } from 'uuid';

import ChatApp from './ChatApp';
import { ConversationStub } from '../models/Conversation';
import { ConversationStubJson } from '../utils/json/ConversationJson';
import { SyncedUser } from '../models/User';
import { UserJson } from '../utils/json/UserJson';
import NchatApi from '../utils/NchatApi';
import NchatWebSocket, { WSRequest, WSSuccessResponse } from '../utils/NchatWebSocket';

import "./ChatAppLoader.css";

interface GetAuthenticateResponse {
  user: UserJson,
}

interface GetConversationStubsResponse {
  conversations: ConversationStubJson[];
}

interface WSAuthRequestData {
  authKey: string,
}

interface WSAuthResponseData {
}

interface ChatAppLoaderProps extends RouteComponentProps {
  authKey: string,
  user: SyncedUser | null,
}

interface ChatAppLoaderState {
  user: SyncedUser | null,
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

  async initUser(): Promise<SyncedUser> {
    const response =
      await NchatApi.get<GetAuthenticateResponse>("authenticate", this.props.authKey);
    const user: SyncedUser = {
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
    }
    return user;
  }

  async initConversationStubs(): Promise<ConversationStub[]> {
    const response =
      await NchatApi.get<GetConversationStubsResponse>("conversations", this.props.authKey);

    const conversationStubs = response.data.conversations.map(conversationStub => {
      return {
        ...conversationStub,
        uuid: uuidv4(),
      }
    })
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