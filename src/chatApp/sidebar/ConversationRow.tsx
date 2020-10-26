import React from 'react';
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';

import "./ConversationRow.css"

interface ConversationRowProps extends RouteComponentProps {
  selected: boolean,
  conversation: Conversation,
  handleConversationRowClick: (conversation: Conversation) => void,
}

function ConversationRow(props: ConversationRowProps) {
  return (
    <div
      className={"ConversationRow" + (props.selected ? " ConversationRow--selected" : "")}
      onClick={() => props.handleConversationRowClick(props.conversation)}>
      <div className="ConversationRow__name">
        {props.conversation.conversationPartner.name
          ?? props.conversation.conversationPartner.username}
      </div>
      <div className="ConversationRow__preview"></div>
    </div>
  );
}

export default ConversationRow;
