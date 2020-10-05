import React from 'react'

import './MessageInput.css'

function MessageInput() {
  return (
    <div className="MessageInput">
      <input className="MessageInput__input" type="text" />
      <button className="MessageInput__button">Send</button>
    </div>
  );
}

export default MessageInput;