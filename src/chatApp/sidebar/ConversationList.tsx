import React from 'react';
import { RouteComponentProps } from "@reach/router";

import ConversationRow from './ConversationRow';
import { Conversation } from '../../models/Conversation';

import "./ConversationList.css"

interface ConversationListProps extends RouteComponentProps {
  conversations: Conversation[],
  selectedConversation: Conversation | null,
  handleConversationRowClick: (conversation: Conversation) => void,
}

function ConversationList(props: ConversationListProps) {
  const conversationRows = props.conversations.map(conversation => {
    return (
      <ConversationRow
        key={conversation.uuid}
        selected={conversation.uuid === props.selectedConversation?.uuid}
        conversation={conversation}
        handleConversationRowClick={props.handleConversationRowClick} />
    );
  });
  return (
    <div className="ConversationList">
      {conversationRows}
    </div>
  );
}

export default ConversationList;
