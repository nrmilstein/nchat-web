import React from "react"
import { RouteComponentProps } from "@reach/router";

import { ChatAppContext } from "../ChatAppContext";
import Message from "../../models/Message";

import "./MessageView.css"

interface MessageViewProps extends RouteComponentProps {
  message: Message,
}

function MessageView(props: MessageViewProps) {
  return (
    <ChatAppContext.Consumer>
      {context =>
        <div
          className={"MessageView " + (context.user?.id === props.message.userId
            ? "MessageView--us"
            : "MessageView--them")} >
          <span className="MessageView__messageBody">
            {props.message.body}
          </span>
        </div >
      }
    </ChatAppContext.Consumer >
  );
}

export default MessageView;
