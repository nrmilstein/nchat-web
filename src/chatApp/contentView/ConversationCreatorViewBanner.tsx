import React, { ChangeEvent, FocusEvent } from 'react';

import './ConversationCreatorViewBanner.css'
import '../../misc/LoadingIcon.css';

export enum ConversationCreatorViewBannerStatus {
  Empty,
  Loading,
  Ok,
  Error,
}

interface ConversationCreatorViewBannerProps {
  conversationCreatorUsername: string,
  status: ConversationCreatorViewBannerStatus,
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void,
  handleBlur: (event: FocusEvent<HTMLInputElement>) => void,
}

interface ConversationCreatorViewBannerState {
}

class ConversationCreatorViewBanner extends
  React.Component<ConversationCreatorViewBannerProps, ConversationCreatorViewBannerState> {
  render() {
    let status: JSX.Element;
    switch (this.props.status) {
      case ConversationCreatorViewBannerStatus.Empty:
        status = <span className="ConversationCreatorViewBanner__to">To:</span>;
        break;
      case ConversationCreatorViewBannerStatus.Error:
        status = <div className="ConversationCreatorViewBanner__error"
          title="Username doesn't exist"></div>;
        break;
      case ConversationCreatorViewBannerStatus.Loading:
        status = <div className="ConversationCreatorViewBanner__loading LoadingIcon"
          title="Checking username..."></div>;
        break;
      case ConversationCreatorViewBannerStatus.Ok:
        status = <div className="ConversationCreatorViewBanner__success"
          title="Username OK"></div>;
        break;
    }
    return (
      <header className="ConversationCreatorViewBanner">
        <div className="ConversationCreatorViewBanner__status">
          <label
            htmlFor="ConversationCreatorViewBannerInput"
            className="ConversationCreatorViewBanner__label">
            {status}
          </label>
        </div>
        <input
          type="text"
          className="ConversationCreatorViewBanner__input"
          placeholder="Username"
          value={this.props.conversationCreatorUsername}
          autoFocus={true}
          onChange={this.props.handleChange}
          onBlur={this.props.handleBlur}
          id="ConversationCreatorViewBannerInput" />
        <img className="ConversationCreatorViewBanner__logo" src="/img/logo.svg" alt="nchat logo" />
      </header>
    );
  }
}

export default ConversationCreatorViewBanner;