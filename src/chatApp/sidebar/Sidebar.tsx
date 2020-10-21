import React from 'react';
import { RouteComponentProps } from "@reach/router";

import SidebarBanner from './SidebarBanner';
import ConversationStubList from './ConversationStubList';
import { ConversationStub, Conversation } from '../../models/Conversation';

import './Sidebar.css'

interface SidebarProps extends RouteComponentProps {
  conversationStubs: Array<ConversationStub>,
  selectedConversationStub: ConversationStub | null,
  conversation: Conversation | null,
  handleNewConversation: () => void,
  handleConversationStubClick: (conversation: ConversationStub) => void,
}

function Sidebar(props: SidebarProps) {
  return (
    <nav className="Sidebar">
      <SidebarBanner handleNewConversation={props.handleNewConversation} />
      <ConversationStubList
        conversationStubs={props.conversationStubs}
        selectedConversationStub={props.selectedConversationStub}
        handleConversationStubClick={props.handleConversationStubClick} />
    </nav>
  );
}

export default Sidebar;
