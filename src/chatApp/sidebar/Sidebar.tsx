import React from 'react';
import { RouteComponentProps } from "@reach/router";

import SidebarBanner from './SidebarBanner';
import ConversationStubList from './ConversationStubList';
import ConversationStub from '../../models/ConversationStub';
import Conversation from '../../models/Conversation';

import './Sidebar.css'

interface SidebarProps extends RouteComponentProps {
  conversationStubs: Array<ConversationStub>,
  handleConversationStubClick: (conversation: ConversationStub) => void,
  conversation: Conversation | null,
}

function Sidebar(props: SidebarProps) {
  return (
    <nav className="Sidebar">
      <SidebarBanner />
      <ConversationStubList
        conversationStubs={props.conversationStubs}
        handleConversationStubClick={props.handleConversationStubClick}
        conversation={props.conversation} />
    </nav>
  );
}

export default Sidebar;
