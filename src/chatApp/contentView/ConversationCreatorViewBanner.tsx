import React, { ChangeEvent, FocusEvent } from 'react';
import LoadingIcon from '../../misc/LoadingIcon';

import './ConversationCreatorViewBanner.css'

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
    const toSpan =
      <span className="ConversationCreatorViewBanner__to">To:</span>

    let status: JSX.Element;
    switch (this.props.status) {
      case ConversationCreatorViewBannerStatus.Empty:
        status = toSpan;
        break;
      case ConversationCreatorViewBannerStatus.Error:
        status = <span className="ConversationCreatorViewBanner__error">✕</span>;
        break;
      case ConversationCreatorViewBannerStatus.Loading:
        status = <LoadingIcon width={20} height={20} />;
        break;
      case ConversationCreatorViewBannerStatus.Ok:
        status = <span className="ConversationCreatorViewBanner__success">✔</span>;
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
      </header>
    );
  }
}

export default ConversationCreatorViewBanner;