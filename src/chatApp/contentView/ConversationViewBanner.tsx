import React from 'react'
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';

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
      <img className="ConversationViewBanner__logo" src="/img/logo.svg" alt="nchat logo" />
    </header>
  );
}

export default ConversationViewBanner;