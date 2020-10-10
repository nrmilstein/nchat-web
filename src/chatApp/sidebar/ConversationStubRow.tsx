import React from 'react';
import { RouteComponentProps } from "@reach/router";

import ConversationStub from '../../models/ConversationStub';
import Conversation from '../../models/Conversation';

import "./ConversationStubRow.css"

interface ConversationStubRowProps extends RouteComponentProps {
  conversationStub: ConversationStub,
  handleConversationStubClick: (conversation: ConversationStub) => void,
}

function ConversationStubRow(props: ConversationStubRowProps) {
  return (
    <div className="ConversationStubRow"
      onClick={() => props.handleConversationStubClick(props.conversationStub)}>
      <div className="ConversationStubRow__name">
        {props.conversationStub.conversationPartner.name}
      </div>
      <div className="ConversationStubRow__preview"></div>
    </div>
  );
}

export default ConversationStubRow;
