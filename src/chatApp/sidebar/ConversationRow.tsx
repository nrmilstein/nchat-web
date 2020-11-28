import React from 'react';
import { RouteComponentProps } from "@reach/router";
import { format as formatDate, differenceInCalendarDays } from 'date-fns';

import { Conversation } from '../../models/Conversation';

import styles from "./ConversationRow.module.css"

interface ConversationRowProps extends RouteComponentProps {
  selected: boolean,
  conversation: Conversation,
  handleConversationRowClick: (conversation: Conversation) => void,
}

function ConversationRow(props: ConversationRowProps) {
  const lastMessage = props.conversation.messages[props.conversation.messages.length - 1];

  const daysDifference = differenceInCalendarDays(new Date(), lastMessage.sent);
  let messageTimeStr: string;

  if (daysDifference === 0) {
    messageTimeStr = formatDate(lastMessage.sent, 'p');
  } else if (daysDifference === 1) {
    messageTimeStr = "yesterday"
  } else if (daysDifference < 7) {
    messageTimeStr = formatDate(lastMessage.sent, 'cccc');
  } else {
    messageTimeStr = formatDate(lastMessage.sent, 'P');
  }

  const conversationPartnerName = props.conversation.conversationPartner.name
    ?? props.conversation.conversationPartner.username

  return (
    <div
      className={styles.main + (props.selected ? " " + styles.main_selected : "")
      }
      onClick={() => props.handleConversationRowClick(props.conversation)}>
      <div className={styles.bubble}>
        {conversationPartnerName.split(" ").slice(0, 2).map(e => e.charAt(0).toUpperCase())}
      </div>
      <div className={styles.full}>
        <div className={styles.header}>
          <div className={styles.name}>
            {conversationPartnerName}
          </div>
          <div className={styles.time}>{messageTimeStr}</div>
        </div>
        <div className={styles.message}>
          {lastMessage.body}
        </div>
      </div>
    </div >
  );
}

export default ConversationRow;
