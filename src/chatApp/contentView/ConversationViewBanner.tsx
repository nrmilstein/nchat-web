import React from 'react'
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';

import { ReactComponent as NchatLogoCompact } from '../../assets/logoCompact.svg';
import { ReactComponent as NchatLogo } from '../../assets/logo.svg';

import './ConversationViewBanner.css'

interface ConversationViewBannerProps extends RouteComponentProps {
  selectedConversation: Conversation,
}

interface ConversationViewBannerState {
}

function ConversationViewBanner(props: ConversationViewBannerProps) {
  return (
    <header className="ConversationViewBanner">
      <div className="ConversationViewBanner__name">
        {props.selectedConversation.conversationPartner.name
          ?? props.selectedConversation.conversationPartner.username}
      </div>
      <NchatLogoCompact className="ConversationViewBanner__logoCompact" title="nchat logo" />
      <NchatLogo className="ConversationViewBanner__logo" title="nchat logo" />
    </header>
  );
}

export default ConversationViewBanner;