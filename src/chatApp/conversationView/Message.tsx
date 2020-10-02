import React from "react"

import "./Message.css"

export enum MessageFrom {
  Us,
  Them,
}

type MessageProps = {
  from: MessageFrom
}

function Message({ from } : MessageProps) {
  return (
    <div 
      className={"Message " + (from === MessageFrom.Us ? "Message--us" : "Message--them")}
    >
      Sup breh?
    </div>
  );
}

export default Message;