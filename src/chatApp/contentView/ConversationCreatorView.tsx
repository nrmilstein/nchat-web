import React, { FocusEvent } from 'react';

import ConversationCreatorViewBanner from './ConversationCreatorViewBanner';
import MessageInput from './MessageInput';
import { User } from '../../models/User';
import NchatApi from '../../utils/NchatApi';
import { ChatAppContext } from '../ChatAppContext';
import { UserJson } from '../../utils/json/UserJson';

import './ConversationCreatorView.css';

interface GetUserResponse {
  user: UserJson,
}

interface ConversationCreatorViewProps {
  handleSendMessage: (messageBody: string, user?: User) => void,
}

interface ConversationCreatorViewState {
  username: string,
  conversationPartner: User | null,
}

class ConversationCreatorView
  extends React.Component<ConversationCreatorViewProps, ConversationCreatorViewState> {

  static contextType = ChatAppContext;
  context!: React.ContextType<typeof ChatAppContext>

  state: ConversationCreatorViewState = {
    username: "",
    conversationPartner: null,
  }

  constructor(props: ConversationCreatorViewProps) {
    super(props);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleUsernameInputBlur = this.handleUsernameInputBlur.bind(this);
  }

  handleUsernameChange(username: string) {
    this.setState({
      username: username,
    });
  }

  handleSendMessage(messageBody: string): boolean {
    if (this.state.conversationPartner === null) {
      return false;
    }
    this.props.handleSendMessage(messageBody, this.state.conversationPartner);
    return true;
  }

  async handleUsernameInputBlur(event: FocusEvent<HTMLInputElement>) {
    const username = this.state.username;
    try {
      if (username.trim() === "") {
        throw new Error("username is empty.");
      }

      const response =
        await NchatApi.get<GetUserResponse>("users/" + username, this.context.authKey);
      const userJson = response.data.user;

      this.setState({
        conversationPartner: {
          id: userJson.id,
          username: userJson.username,
          name: userJson.name,
        },
      });
    } catch (e) {
      this.setState({
        conversationPartner: null,
      });
    }
  }

  render() {
    return (
      <div className="ConversationCreatorView">
        <ConversationCreatorViewBanner
          conversationCreatorUsername={this.state.username}
          handleUsernameChange={this.handleUsernameChange}
          handleBlur={this.handleUsernameInputBlur} />
        <div className="ConversationCreatorView__spacer" />
        <MessageInput
          autoFocus={false}
          handleSendMessage={this.handleSendMessage} />
      </div>
    )
  }
}

export default ConversationCreatorView;