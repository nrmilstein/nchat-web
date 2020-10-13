import React from 'react'
import { RouteComponentProps } from "@reach/router";

import Conversation from '../../models/Conversation';

import './ConversationViewBanner.css'

interface ConversationViewBannerProps extends RouteComponentProps {
  conversation: Conversation,
}

function ConversationViewBanner(props: ConversationViewBannerProps) {
  return (
    <div className="ConversationViewBanner">
      { props.conversation.conversationPartner.name ?? ""}
    </div>
  );
}

export default ConversationViewBanner;