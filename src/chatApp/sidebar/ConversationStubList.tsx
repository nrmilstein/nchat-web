import React from 'react';
import { RouteComponentProps } from "@reach/router";

import ConversationStubRow from './ConversationStubRow';
import ConversationStub from '../../models/ConversationStub';

import "./ConversationStubList.css"

interface ConversationStubListProps extends RouteComponentProps {
  conversationStubs: Array<ConversationStub> | null,
  handleConversationStubClick: (conversation: ConversationStub) => void,
}

function ConversationStubList(props: ConversationStubListProps) {
  let conversationRows: Array<JSX.Element>;
  if (props.conversationStubs !== null) {
    conversationRows = props.conversationStubs.map(conversation => {
      return (
        <ConversationStubRow
          key={conversation.id}
          conversationStub={conversation}
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
