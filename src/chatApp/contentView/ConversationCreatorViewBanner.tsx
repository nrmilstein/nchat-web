import React, { ChangeEvent, FocusEvent } from 'react';

import { ReactComponent as GreenCheck } from './greenCheck.svg';
import { ReactComponent as RedX } from './redX.svg';

import { ReactComponent as NchatLogoCompact } from '../../assets/logoCompact.svg';
import { ReactComponent as NchatLogo } from '../../assets/logo.svg';

import styles from './ConversationCreatorViewBanner.module.css'
import loadingIconStyles from '../../assets/LoadingIcon.module.css';

export enum ConversationCreatorViewBannerStatus {
  Empty,
  Loading,
  Ok,
  Error,
}

interface ConversationCreatorViewBannerProps {
  conversationCreatorUsername: string,
  status: {
    value: ConversationCreatorViewBannerStatus,
    message?: string,
  },
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void,
  handleBlur: (event: FocusEvent<HTMLInputElement>) => void,
}

interface ConversationCreatorViewBannerState {
}

class ConversationCreatorViewBanner extends
  React.Component<ConversationCreatorViewBannerProps, ConversationCreatorViewBannerState> {
  render() {
    let status: JSX.Element;
    switch (this.props.status.value) {
      case ConversationCreatorViewBannerStatus.Empty:
        status = <span className={styles.to}>To:</span>;
        break;
      case ConversationCreatorViewBannerStatus.Loading:
        status = <div className={styles.loading + " " + loadingIconStyles.main}
          title="Checking username..." ></div >;
        break;
      case ConversationCreatorViewBannerStatus.Error:
        status = <RedX className={styles.error}
          title={this.props.status.message} />
        break;
      case ConversationCreatorViewBannerStatus.Ok:
        status = <GreenCheck className={styles.success}
          title="Username OK" />
        break;
    }
    return (
      <header className={styles.main} >
        <div className={styles.status}>
          <label
            htmlFor="ConversationCreatorViewBannerInput"
            className={styles.label}>
            {status}
          </label>
        </div>
        <input
          id="ConversationCreatorViewBannerInput"
          className={styles.input}
          type="text"
          value={this.props.conversationCreatorUsername}
          autoFocus={true}
          onChange={this.props.handleChange}
          onBlur={this.props.handleBlur}
          placeholder="Username"
          autoComplete="off" />
        <NchatLogoCompact className={styles.logoCompact} title="nchat logo" />
        <NchatLogo className={styles.logo} title="nchat logo" />
      </header>
    );
  }
}

export default ConversationCreatorViewBanner;