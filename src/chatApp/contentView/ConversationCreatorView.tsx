import React, { ChangeEvent, FocusEvent } from 'react';

import ConversationCreatorViewBanner, { ConversationCreatorViewBannerStatus }
  from './ConversationCreatorViewBanner';
import MessageInput from './MessageInput';
import { User } from '../../models/User';
import NchatApi from '../../utils/NchatApi';
import { ChatAppContext } from '../ChatAppContext';
import { UserJson } from '../../utils/json/UserJson';

import styles from './ConversationCreatorView.module.css';

interface GetUserResponse {
  user: UserJson,
}

interface ConversationCreatorViewProps {
  handleCreateConversation: (messageBody: string, conversationPartner: User) => void,
}

interface ConversationCreatorViewState {
  username: string,
  conversationPartner: User | null,
  usernameInputStatus: {
    value: ConversationCreatorViewBannerStatus,
    message?: string,
  },
}

class ConversationCreatorView
  extends React.Component<ConversationCreatorViewProps, ConversationCreatorViewState> {

  static contextType = ChatAppContext;
  context!: React.ContextType<typeof ChatAppContext>

  state: ConversationCreatorViewState = {
    username: "",
    conversationPartner: null,
    usernameInputStatus: {
      value: ConversationCreatorViewBannerStatus.Empty,
    }
  }

  constructor(props: ConversationCreatorViewProps) {
    super(props);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleUsernameInputBlur = this.handleUsernameInputBlur.bind(this);
  }

  handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    const username = event.target.value;
    this.setState({
      usernameInputStatus: { value: ConversationCreatorViewBannerStatus.Empty },
      username: username,
    });
  }

  handleSendMessage(messageBody: string): boolean {
    if (this.state.conversationPartner === null) {
      return false;
    }
    this.props.handleCreateConversation(messageBody, this.state.conversationPartner);
    return true;
  }

  async handleUsernameInputBlur(event: FocusEvent<HTMLInputElement>) {
    this.setState({
      usernameInputStatus: { value: ConversationCreatorViewBannerStatus.Loading },
    });

    const username = this.state.username.trim();

    if (username === "") {
      this.setState({
        usernameInputStatus: { value: ConversationCreatorViewBannerStatus.Empty },
      });
      return;
    } else if (username === this.context.user.username) {
      this.setState({
        usernameInputStatus: {
          value: ConversationCreatorViewBannerStatus.Error,
          message: "Cannot send message to self.",
        }
      });
      return;
    }

    try {
      const conversationPartner = await this.getUser(username);
      this.setState({
        conversationPartner: conversationPartner,
        usernameInputStatus: { value: ConversationCreatorViewBannerStatus.Ok },
      });
    } catch (err) {
      this.setState({
        conversationPartner: null,
        usernameInputStatus: {
          value: ConversationCreatorViewBannerStatus.Error,
          message: "Username not found."
        },
      });
    }
  }

  async getUser(username: string): Promise<User> {
    const response =
      await NchatApi.get<GetUserResponse>("users/" + username, this.context.authKey);
    const userJson = response.data.user;

    return {
      id: userJson.id,
      username: userJson.username,
      name: userJson.name,
    }
  }

  render() {
    return (
      <div className={styles.main}>
        <ConversationCreatorViewBanner
          conversationCreatorUsername={this.state.username}
          status={this.state.usernameInputStatus}
          handleChange={this.handleUsernameChange}
          handleBlur={this.handleUsernameInputBlur} />
        <div className={styles.spacer} />
        <MessageInput
          autoFocus={false}
          handleSendMessage={this.handleSendMessage}
          disabled={this.state.usernameInputStatus.value !== ConversationCreatorViewBannerStatus.Ok} />
      </div>
    )
  }
}

export default ConversationCreatorView;