import React from 'react';
import {RouteComponentProps} from "@reach/router";

import ConversationStub from '../../models/ConversationStub';

import "./ConversationRow.css"

interface ConversationRowProps extends RouteComponentProps {
  conversation: ConversationStub,
}

function ConversationRow(props: ConversationRowProps) {
  return (
    <div className="ConversationRow">
      <div className="ConversationRow__name">{props.conversation.users[0].name}</div>
      <div className="ConversationRow__preview"></div>
    </div>
  );
}

export default ConversationRow;
