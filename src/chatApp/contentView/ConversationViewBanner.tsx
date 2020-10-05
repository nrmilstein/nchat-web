import React from 'react'
import { RouteComponentProps } from "@reach/router";

import Conversation from '../../models/Conversation';

import './ConversationViewBanner.css'

interface ConversationViewBannerProps extends RouteComponentProps {
  conversation: Conversation | null,
}

function ConversationViewBanner(props: ConversationViewBannerProps) {
  return (
    <div className="ConversationViewBanner">
      { props.conversation?.users[0].name ?? ""}
    </div>
  );
}

export default ConversationViewBanner;