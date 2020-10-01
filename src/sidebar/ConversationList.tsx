import React from 'react';

import ConversationRow from './ConversationRow';

import "./ConversationList.css"

function ConversationList() {
  return (
    <div className="ConversationList">
      { Array(20).fill(<ConversationRow />)}
    </div>
  );
}

export default ConversationList;