import React from 'react';
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';
import ConversationView from './ConversationView';
import ConversationCreatorView from './ConversationCreatorView';
import { User } from '../../models/User';

import { ReactComponent as NchatLogoCompact } from '../../assets/logoCompact.svg';
import { ReactComponent as NchatLogo } from '../../assets/logo.svg';
import { ReactComponent as PlusIcon } from '../sidebar/plus.svg';

import styles from "./ContentView.module.css";

interface ContentViewProps extends RouteComponentProps {
  isConversationCreatorOpen: boolean,
  selectedConversation: Conversation | null,
  handleSendMessage: (messageBody: string, user?: User) => void,
}

function ContentView(props: ContentViewProps) {
  let content: JSX.Element;
  if (props.isConversationCreatorOpen) {
    content = <ConversationCreatorView
      handleSendMessage={props.handleSendMessage} />
  } else if (props.selectedConversation !== null) {
    content = <ConversationView
      selectedConversation={props.selectedConversation}
      handleSendMessage={props.handleSendMessage}
      key={props.selectedConversation?.uuid} />
  } else {
    const actionPhrase = window.matchMedia("(hover: hover)").matches ? "Click" : "Tap";
    content =
      <div className={styles.noConversationContainer}>
        <div className={styles.noConversation}>
          <NchatLogoCompact className={styles.logo + " " + styles.logoCompact} title="nchat logo" />
          <NchatLogo className={styles.logo + " " + styles.logoFull} title="nchat logo" />
          <div className={styles.hint}>
            {actionPhrase}
            &nbsp;
          <PlusIcon className={styles.newChatIcon} title="New conversation" />
          &nbsp;
          to start a new conversation.
        </div>
        </div>
      </div >
  }
  return (
    <main className={styles.main}>
      {content}
    </main>
  );
}

export default ContentView;
