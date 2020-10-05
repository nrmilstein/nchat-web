import React from 'react';
import { RouteComponentProps } from "@reach/router";

import ConversationStubRow from './ConversationStubRow';
import ConversationStub from '../../models/ConversationStub';

import "./ConversationStubList.css"

interface ConversationStubListProps extends RouteComponentProps {
  conversations: Array<ConversationStub> | null,
  handleConversationStubClick: (conversation: ConversationStub) => void,
}

function ConversationStubList(props: ConversationStubListProps) {
  let conversationRows: Array<JSX.Element>;
  if (props.conversations !== null) {
    conversationRows = props.conversations.map(conversation => {
      return (
        <ConversationStubRow conversation={conversation}
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
