import React from 'react';
import { RouteComponentProps } from "@reach/router";

import SidebarBanner from './SidebarBanner';
import ConversationList from './ConversationList';
import { Conversation } from '../../models/Conversation';

import './Sidebar.css'

interface SidebarProps extends RouteComponentProps {
  conversations: Conversation[],
  selectedConversationUuid: string | null,
  handleNewConversation: () => void,
  handleConversationRowClick: (conversation: Conversation) => void,
  logoutHandler: () => void,
}

function Sidebar(props: SidebarProps) {
  return (
    <nav className="Sidebar">
      <SidebarBanner
        handleNewConversation={props.handleNewConversation}
        logoutHandler={props.logoutHandler} />
      <ConversationList
        conversations={props.conversations}
        selectedConversationUuid={props.selectedConversationUuid}
        handleConversationRowClick={props.handleConversationRowClick} />
    </nav>
  );
}

export default Sidebar;
