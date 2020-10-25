import React from 'react';
import { RouteComponentProps } from "@reach/router";

import SidebarBanner from './SidebarBanner';
import ConversationList from './ConversationList';
import { Conversation } from '../../models/Conversation';

import './Sidebar.css'

interface SidebarProps extends RouteComponentProps {
  conversations: Conversation[],
  selectedConversation: Conversation | null,
  handleNewConversation: () => void,
  handleConversationRowClick: (conversation: Conversation) => void,
}

function Sidebar(props: SidebarProps) {
  return (
    <nav className="Sidebar">
      <SidebarBanner handleNewConversation={props.handleNewConversation} />
      <ConversationList
        conversations={props.conversations}
        selectedConversation={props.selectedConversation}
        handleConversationRowClick={props.handleConversationRowClick} />
    </nav>
  );
}

export default Sidebar;
