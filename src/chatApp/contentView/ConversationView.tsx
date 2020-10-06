import React, { UIEvent } from 'react'
import { RouteComponentProps } from "@reach/router";

import MessageView from './MessageView';
import Conversation from '../../models/Conversation';

import './ConversationView.css'

interface ConversationViewProps extends RouteComponentProps {
  conversation: Conversation | null,
  setScrollToBottomHandler: (scrollToBottomHandler: () => void) => void,
}

interface ConversationViewState {
}

class ConversationView extends React.Component<ConversationViewProps, ConversationViewState> {
  state: ConversationViewState = {
    scrollTop: 0,
  }

  conversationViewDiv = React.createRef<HTMLDivElement>();

  constructor(props: ConversationViewProps) {
    super(props);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.props.setScrollToBottomHandler(this.scrollToBottom);
  }

  scrollToBottom() {
    const node = this.conversationViewDiv.current;
    if (node === null) {
      return;
    }
    node.scrollTo(0, node.scrollHeight - node.clientHeight);
  }

  render() {
    let messages: JSX.Element[] = [];
    if (this.props.conversation !== null) {
      messages = this.props.conversation.messages.map(message => {
        return <MessageView key={message.id} message={message} />
      });
    }
    return (
      <div className="ConversationView" ref={this.conversationViewDiv}>
        {messages}
      </div>
    );
  }
}

export default ConversationView;
