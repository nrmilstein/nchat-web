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
    <header className="ConversationViewBanner" >
      <div className="ConversationViewBanner__name">
        {props.selectedConversation.conversationPartner.name
          ?? props.selectedConversation.conversationPartner.username}
      </div>
    </header >
  );
}

export default ConversationViewBanner;