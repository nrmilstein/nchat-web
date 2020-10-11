import React, { UIEvent } from 'react'
import { RouteComponentProps } from "@reach/router";

import MessageView from './MessageView';
import Conversation from '../../models/Conversation';

import './ConversationView.css'
import { ChatAppContext } from '../ChatAppContext';

interface ConversationViewProps extends RouteComponentProps {
  conversation: Conversation | null,
}

interface ConversationViewState {
}

interface ConversationViewSnapshot {
  isScrolledToBottom: boolean,
}

class ConversationView extends React.Component<ConversationViewProps, ConversationViewState> {
  // Number of pixels chat div can be scrolled above bottom to still be considered at bottom
  SCROLL_TOLERANCE = 40;

  state: ConversationViewState = {
    scrollTop: 0,
  }

  conversationViewDiv = React.createRef<HTMLDivElement>();

  static contextType = ChatAppContext;
  context!: React.ContextType<typeof ChatAppContext>

  constructor(props: ConversationViewProps) {
    super(props);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  getSnapshotBeforeUpdate(prevProps: ConversationViewProps, prevState: ConversationViewState):
    ConversationViewSnapshot {
    return {
      isScrolledToBottom: this.isScrolledToBottom()
    };
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

  componentDidUpdate(
    prevProps: ConversationViewProps,
    prevState: ConversationViewState,
    snapshot: ConversationViewSnapshot,
  ) {
    if (prevProps.conversation === null || this.props.conversation === null
      || this.context.user === null) {
      return;
    }
    const prevMessages = prevProps.conversation.messages;
    const messages = this.props.conversation.messages;

    // If there's a new message added
    if (prevMessages[prevMessages.length - 1].id !== messages[messages.length - 1].id) {
      // Keep us scrolled to the bottom if we're already there, or if the last message
      // added is from us (i.e. we just sent a message).
      if (snapshot.isScrolledToBottom
        || messages[messages.length - 1].senderId === this.context.user.id) {
        this.scrollToBottom();
      }
    }
  }

  private isScrolledToBottom(): boolean {
    const node = this.conversationViewDiv.current;
    if (node === null) {
      return true;
    }
    return node.scrollTop >= (node.scrollHeight - node.clientHeight) - this.SCROLL_TOLERANCE;
  }

  private scrollToBottom() {
    const node = this.conversationViewDiv.current;
    if (node === null) {
      return;
    }
    node.scrollTo(0, node.scrollHeight - node.clientHeight);
  }
}

export default ConversationView;
