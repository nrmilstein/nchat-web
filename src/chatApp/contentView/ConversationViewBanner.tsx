import React from 'react'
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';

import { ReactComponent as NchatLogoCompact } from '../../assets/logoCompact.svg';
import { ReactComponent as NchatLogo } from '../../assets/logo.svg';

import styles from './ConversationViewBanner.module.css'

interface ConversationViewBannerProps extends RouteComponentProps {
  selectedConversation: Conversation,
}

interface ConversationViewBannerState {
}

function ConversationViewBanner(props: ConversationViewBannerProps) {
  return (
    <header className={styles.main}>
      <div className={styles.name}>
        {props.selectedConversation.conversationPartner.name
          ?? props.selectedConversation.conversationPartner.username}
      </div>
      <NchatLogoCompact className={styles.logoCompact} title="nchat logo" />
      <NchatLogo className={styles.logo} title="nchat logo" />
    </header>
  );
}

export default ConversationViewBanner;