import React, { ChangeEvent, FocusEvent } from 'react';

import './ConversationCreatorViewBanner.css'

interface ConversationCreatorViewBannerProps {
  conversationCreatorUsername: string,
  handleUsernameChange: (username: string) => void,
  handleBlur: (event: FocusEvent<HTMLInputElement>) => void,
}

interface ConversationCreatorViewBannerState {
}

class ConversationCreatorViewBanner extends
  React.Component<ConversationCreatorViewBannerProps, ConversationCreatorViewBannerState> {
  constructor(props: ConversationCreatorViewBannerProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    this.props.handleUsernameChange(event.target.value);
  }

  render() {
    return (
      <header className="ConversationCreatorViewBanner">
        <label className="ConversationCreatorViewBanner__toFieldLabel">To:
          <input
            type="text"
            className="ConversationCreatorViewBanner__input"
            placeholder="Username"
            value={this.props.conversationCreatorUsername}
            onChange={this.handleChange}
            autoFocus={true}
            onBlur={this.props.handleBlur} />
        </label>
      </header>
    );
  }
}

export default ConversationCreatorViewBanner;