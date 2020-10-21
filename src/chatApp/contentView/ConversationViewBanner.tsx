import React from 'react'
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';

import './ConversationViewBanner.css'

interface ConversationViewBannerProps extends RouteComponentProps {
  conversation: Conversation,
}

function ConversationViewBanner(props: ConversationViewBannerProps) {
  return (
    <header className="ConversationViewBanner">
      { props.conversation.conversationPartner.name ?? ""}
    </header>
  );
}

export default ConversationViewBanner;