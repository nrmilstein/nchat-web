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
      {props.selectedConversation.conversationPartner.name
        ?? props.selectedConversation.conversationPartner.username}
    </header >
  );
}

export default ConversationViewBanner;