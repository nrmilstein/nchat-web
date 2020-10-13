import React from 'react';
import { RouteComponentProps } from '@reach/router';

import ChatApp from './ChatApp';
import ConversationStub from '../models/ConversationStub';
import User from '../models/User';
import NchatApi from '../utils/NchatApi';

import "./ChatAppLoader.css"

interface GetAuthenticateResponse {
  user: User,
}

interface GetConversationStubsResponse {
  conversations: ConversationStub[];
}

interface ChatAppLoaderProps extends RouteComponentProps {
  authKey: string,
  user: User | null,
}

interface ChatAppLoaderState {
  user: User | null,
  conversationStubs: ConversationStub[] | null,
  webSocket: WebSocket | null,
}

class ChatAppLoader extends React.Component<ChatAppLoaderProps, ChatAppLoaderState> {
  state: ChatAppLoaderState = {
    user: this.props.user,
    conversationStubs: null,
    webSocket: null,
  }

  async componentDidMount() {
    const webSocketPromise = this.initWebSocket();
    const conversationStubsPromise = this.initConversationStubs();

    const user = this.state.user ?? await this.initUser();
    const webSocket = await webSocketPromise;
    const conversationStubs = await conversationStubsPromise

    this.setState({
      user: user,
      conversationStubs: conversationStubs,
      webSocket: webSocket,
    })
  }

  async initConversationStubs(): Promise<ConversationStub[]> {
    const response =
      await NchatApi.get<GetConversationStubsResponse>("conversations", this.props.authKey);
    const conversationStubs = response.data.conversations;
    return conversationStubs;
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

  initWebSocket(): Promise<WebSocket> {
    const webSocket = new WebSocket("ws://localhost:3000/api/v1/chat", "nchat");
    return new Promise(function (resolve, reject) {
      webSocket.addEventListener("open", (event: Event) => {
        resolve(webSocket);
      })
      webSocket.addEventListener("error", (event: Event) => {
        reject(event);
      })
    });
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