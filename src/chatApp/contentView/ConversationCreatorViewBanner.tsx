import React, { ChangeEvent, FocusEvent } from 'react';

import { ReactComponent as GreenCheck } from './greenCheck.svg';
import { ReactComponent as RedX } from './redX.svg';

import { ReactComponent as NchatLogoCompact } from '../../assets/logoCompact.svg';
import { ReactComponent as NchatLogo } from '../../assets/logo.svg';

import './ConversationCreatorViewBanner.css'
import '../../assets/LoadingIcon.css';

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
        status = <RedX className="ConversationCreatorViewBanner__error"
          title="Username doesn't exist" />
        break;
      case ConversationCreatorViewBannerStatus.Loading:
        status = <div className="ConversationCreatorViewBanner__loading LoadingIcon"
          title="Checking username..."></div>;
        break;
      case ConversationCreatorViewBannerStatus.Ok:
        status = <GreenCheck className="ConversationCreatorViewBanner__success"
          title="Username OK" />
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
        <NchatLogoCompact className="ConversationViewBanner__logoCompact" title="nchat logo" />
        <NchatLogo className="ConversationCreatorViewBanner__logo" title="nchat logo" />
      </header>
    );
  }
}

export default ConversationCreatorViewBanner;