import React from 'react';
import { RouteComponentProps } from "@reach/router";

import { Conversation } from '../../models/Conversation';
import ConversationView from './ConversationView';
import ConversationCreatorView from './ConversationCreatorView';
import { User } from '../../models/User';

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
    content =
      <div className="ContentView__noConversationContainer">
        <div className="ContentView__noConversation">
          <img className="ContentView__logo" src="/img/logo.svg" alt="nchat logo" />
          <div className="ContentView__hint">
            Click the
            &nbsp;
          <img className="ContentView__newChatIcon" src="/img/plus.svg" alt="New conversation" />
          &nbsp;
          button to start a new conversation.
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
