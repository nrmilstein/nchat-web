import React from 'react';
import { RouteComponentProps } from "@reach/router";

import ConversationStub from '../../models/ConversationStub';
import Conversation from '../../models/Conversation';

import "./ConversationStubRow.css"

interface ConversationStubRowProps extends RouteComponentProps {
  conversation: ConversationStub,
  handleConversationStubClick: (conversation: ConversationStub) => void,
}

function ConversationStubRow(props: ConversationStubRowProps) {
  return (
    <div className="ConversationStubRow"
      onClick={() => props.handleConversationStubClick(props.conversation)}>
      <div className="ConversationStubRow__name">{props.conversation.users[0].name}</div>
      <div className="ConversationStubRow__preview"></div>
    </div>
  );
}

export default ConversationStubRow;
