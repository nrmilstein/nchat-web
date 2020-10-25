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
  email: string,
  conversationPartner: User | null,
}

class ConversationCreatorView
  extends React.Component<ConversationCreatorViewProps, ConversationCreatorViewState> {

  static contextType = ChatAppContext;
  context!: React.ContextType<typeof ChatAppContext>

  state: ConversationCreatorViewState = {
    email: "",
    conversationPartner: null,
  }

  constructor(props: ConversationCreatorViewProps) {
    super(props);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleEmailInputBlur = this.handleEmailInputBlur.bind(this);
  }

  handleEmailChange(email: string) {
    this.setState({
      email: email,
    });
  }

  handleSendMessage(messageBody: string): boolean {
    if (this.state.conversationPartner === null) {
      return false;
    }
    this.props.handleSendMessage(messageBody, this.state.conversationPartner);
    return true;
  }

  async handleEmailInputBlur(event: FocusEvent<HTMLInputElement>) {
    const email = this.state.email;
    try {
      if (email.trim() === "") {
        throw new Error("email is empty.");
      }

      const response =
        await NchatApi.get<GetUserResponse>("users/" + email, this.context.authKey);
      const userJson = response.data.user;

      this.setState({
        conversationPartner: {
          id: userJson.id,
          email: userJson.email,
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
          conversationCreatorEmail={this.state.email}
          handleEmailChange={this.handleEmailChange}
          handleBlur={this.handleEmailInputBlur} />
        <div className="ConversationCreatorView__spacer" />
        <MessageInput
          autoFocus={false}
          handleSendMessage={this.handleSendMessage} />
      </div>
    )
  }
}

export default ConversationCreatorView;