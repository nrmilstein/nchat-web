import React from 'react';
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';
import ConversationView from './ConversationView';
import ConversationCreatorView from './ConversationCreatorView';
import { User } from '../../models/User';

import { ReactComponent as NchatLogoCompact } from '../../assets/logoCompact.svg';
import { ReactComponent as NchatLogo } from '../../assets/logo.svg';
import { ReactComponent as PlusIcon } from '../sidebar/plus.svg';

import "./ContentView.css"

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
      <div className="ContentView__noConversationContainer">
        <div className="ContentView__noConversation">
          <NchatLogoCompact className="ContentView__logo ContentView__logoCompact" title="nchat logo" />
          <NchatLogo className="ContentView__logo ContentView__logoFull" title="nchat logo" />
          <div className="ContentView__hint">
            {actionPhrase}
            &nbsp;
          <PlusIcon className="ContentView__newChatIcon" title="New conversation" />
          &nbsp;
          to start a new conversation.
        </div>
        </div>
      </div >
  }
  return (
    <main className="ContentView">
      {content}
    </main>
  );
}

export default ContentView;
