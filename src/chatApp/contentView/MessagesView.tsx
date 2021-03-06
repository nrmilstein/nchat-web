import React from 'react'
import { RouteComponentProps } from "@reach/router";

import MessageView from './MessageView';
import { Message } from '../../models/Message';
import { ChatAppContext } from '../ChatAppContext';

import styles from './MessagesView.module.css'
import loadingIconStyles from '../../assets/LoadingIcon.module.css';

interface MessagesViewProps extends RouteComponentProps {
  isLoading: boolean,
  messages: Message[],
}

interface MessagesViewState {
}

interface MessagesViewSnapshot {
  isScrolledToBottom: boolean,
}

class MessagesView extends React.Component<MessagesViewProps, MessagesViewState> {
  // Number of pixels chat div can be scrolled above bottom to still be considered at bottom
  SCROLL_TOLERANCE = 40;

  conversationViewDiv = React.createRef<HTMLDivElement>();

  static contextType = ChatAppContext;
  context!: React.ContextType<typeof ChatAppContext>

  constructor(props: MessagesViewProps) {
    super(props);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  getSnapshotBeforeUpdate(prevProps: MessagesViewProps, prevState: MessagesViewState):
    MessagesViewSnapshot {
    return {
      isScrolledToBottom: this.isScrolledToBottom()
    };
  }

  componentDidUpdate(
    prevProps: MessagesViewProps,
    prevState: MessagesViewState,
    snapshot: MessagesViewSnapshot,
  ) {
    const prevMessages = prevProps.messages;
    const messages = this.props.messages;

    // If there's a new message added
    if (prevMessages[prevMessages.length - 1]?.uuid !== messages[messages.length - 1]?.uuid) {
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

  render() {
    let messages: JSX.Element[] = this.props.messages.map(message => {
      return <MessageView key={message.uuid} message={message} />
    });
    return (
      <div className={styles.main} ref={this.conversationViewDiv}>
        {this.props.isLoading &&
          <div className={styles.loading}>
            <div className={styles.loadingIcon + " " + loadingIconStyles.main}></div>
          </div>}
        {messages}
      </div>
    );
  }
}

export default MessagesView;
