import React from 'react';
import { RouteComponentProps } from "@reach/router";

import ConversationStubRow from './ConversationStubRow';
import { ConversationStub } from '../../models/Conversation';

import "./ConversationStubList.css"

interface ConversationStubListProps extends RouteComponentProps {
  conversationStubs: ConversationStub[],
  selectedConversationStub: ConversationStub | null,
  handleConversationStubClick: (conversationStub: ConversationStub) => void,
}

function ConversationStubList(props: ConversationStubListProps) {
  let conversationRows: Array<JSX.Element>;
  if (props.conversationStubs !== null) {
    conversationRows = props.conversationStubs.map(conversationStub => {
      return (
        <ConversationStubRow
          key={conversationStub.uuid}
          selected={conversationStub.uuid === props.selectedConversationStub?.uuid}
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
