import React from "react"
import { RouteComponentProps } from "@reach/router";

import Message from "../../models/Message";

import "./MessageView.css"

interface MessageViewProps extends RouteComponentProps {
  message: Message,
}

function MessageView(props: MessageViewProps) {
  return (
    <div className="MessageView" >
    </ div >
  );
}

export default MessageView;
