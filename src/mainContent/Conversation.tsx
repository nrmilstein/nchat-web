import React from 'react'

import './Conversation.css'
import Message from './Message';
import { MessageFrom } from './Message'

function Conversation() {
  return (
    <div className="Conversation">
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Us } />
      <Message from={ MessageFrom.Us } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Us } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Us } />
      <Message from={ MessageFrom.Us } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Us } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Us } />
      <Message from={ MessageFrom.Us } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Us } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Us } />
      <Message from={ MessageFrom.Us } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Them } />
      <Message from={ MessageFrom.Us } />
    </div>
  );
}

export default Conversation;