import React from 'react';
import {RouteComponentProps} from "@reach/router";

import ConversationRow from './ConversationRow';
import ConversationStub from '../../models/ConversationStub';

import "./ConversationList.css"

interface ConversationListProps extends RouteComponentProps {
  conversations: Array<ConversationStub> | null,
}

function ConversationList(props: ConversationListProps) {
  let conversationRows: Array<JSX.Element>;
  if (props.conversations !== null) {
    conversationRows = props.conversations.map(conversation => {
      return <ConversationRow conversation={conversation} />
    });
  } else {
    conversationRows = [];
  }
  return (
    <div className="ConversationList">
      {conversationRows}
    </div>
  );
}

export default ConversationList;
