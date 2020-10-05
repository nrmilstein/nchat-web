import React from "react"
import { RouteComponentProps } from "@reach/router";

import { UserContext } from "../UserContext";
import Message from "../../models/Message";

import "./MessageView.css"

interface MessageViewProps extends RouteComponentProps {
  message: Message,
}

function MessageView(props: MessageViewProps) {
  return (
    <UserContext.Consumer>
      {user =>
        <div
          className={"MessageView " + (user?.id === props.message.userId
            ? "MessageView--us"
            : "MessageView--them")} >
          {props.message.body}
        </div >
      }
    </UserContext.Consumer >
  );
}

export default MessageView;
