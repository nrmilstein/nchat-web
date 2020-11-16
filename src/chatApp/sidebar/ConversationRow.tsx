import React from 'react';
import { RouteComponentProps } from "@reach/router";
import { format as formatDate, differenceInCalendarDays } from 'date-fns';

import { Conversation } from '../../models/Conversation';

import "./ConversationRow.css"

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

  return (
    <div
      className={"ConversationRow" + (props.selected ? " ConversationRow--selected" : "")}
      onClick={() => props.handleConversationRowClick(props.conversation)}>
      <div className="ConversationRow__main">
        <div className="ConversationRow__name">
          {props.conversation.conversationPartner.name
            ?? props.conversation.conversationPartner.username}
        </div>
        <div className="ConversationRow__time">{messageTimeStr}</div>
      </div>
      <div className="ConversationRow__message">
        {lastMessage.body}
      </div>
    </div>
  );
}

export default ConversationRow;
