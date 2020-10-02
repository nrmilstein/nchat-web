import React from 'react';

import ConversationRowName from './ConversationRowName';
import ConversationRowPreview from './ConversationRowPreview';

import "./ConversationRow.css"

function ConversationRow() {
  return (
    <div className="ConversationRow">
      <ConversationRowName />
      <ConversationRowPreview />
    </div>
  );
}

export default ConversationRow;
