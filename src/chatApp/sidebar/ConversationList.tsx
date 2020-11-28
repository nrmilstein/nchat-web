import React from 'react';
import { RouteComponentProps } from "@reach/router";

import ConversationRow from './ConversationRow';
import { Conversation } from '../../models/Conversation';

import styles from "./ConversationList.module.css"

interface ConversationListProps extends RouteComponentProps {
  conversations: Conversation[],
  selectedConversationUuid: string | null,
  handleConversationRowClick: (conversation: Conversation) => void,
}

function ConversationList(props: ConversationListProps) {
  const conversationRows = props.conversations.map(conversation => {
    return (
      <ConversationRow
        key={conversation.uuid}
        selected={conversation.uuid === props.selectedConversationUuid}
        conversation={conversation}
        handleConversationRowClick={props.handleConversationRowClick} />
    );
  });
  return (
    <div className={styles.main}>
      {conversationRows}
    </div>
  );
}

export default ConversationList;
