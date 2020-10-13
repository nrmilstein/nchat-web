import React from 'react';
import { RouteComponentProps } from "@reach/router";

import ConversationStubRow from './ConversationStubRow';
import ConversationStub from '../../models/ConversationStub';
import Conversation from '../../models/Conversation';

import "./ConversationStubList.css"

interface ConversationStubListProps extends RouteComponentProps {
  conversationStubs: ConversationStub[],
  handleConversationStubClick: (conversationStub: ConversationStub) => void,
  conversation: Conversation | null,
}

function ConversationStubList(props: ConversationStubListProps) {
  let conversationRows: Array<JSX.Element>;
  if (props.conversationStubs !== null) {
    conversationRows = props.conversationStubs.map(conversationStub => {
      return (
        <ConversationStubRow
          key={conversationStub.id}
          selected={conversationStub.id === props.conversation?.id}
          conversationStub={conversationStub}
          handleConversationStubClick={props.handleConversationStubClick} />
      );
    });
  } else {
    conversationRows = [];
  }
  return (
    <div className="ConversationStubList">
      {conversationRows}
    </div>
  );
}

export default ConversationStubList;
