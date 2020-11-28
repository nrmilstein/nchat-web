import React from "react"
import { RouteComponentProps } from "@reach/router";

import { ChatAppContext } from "../ChatAppContext";
import { Message } from "../../models/Message";

import styles from './MessageView.module.css'

interface MessageViewProps extends RouteComponentProps {
  message: Message,
}

function MessageView(props: MessageViewProps) {
  return (
    <ChatAppContext.Consumer>
      {context =>
        <div
          className={
            styles.main
            + (context.user?.id === props.message.senderId
              ? (props.message.id === null
                ? " " + styles.fromUs_unsynced
                : " " + styles.fromUs_synced
              )
              : " " + styles.fromThem)
          }>
          <div className={styles.messageBody}>
            {props.message.body}
          </div>
        </div >
      }
    </ChatAppContext.Consumer >
  );
}

export default MessageView;
