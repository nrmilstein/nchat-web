import React from 'react';
import { RouteComponentProps } from "@reach/router";

import SidebarBanner from './SidebarBanner';
import ConversationList from './ConversationList';
import { Conversation } from '../../models/Conversation';

import './Sidebar.css'

interface SidebarProps extends RouteComponentProps {
  conversations: Conversation[],
  selectedConversationUuid: string | null,
  handleLaunchConversationCreator: () => void,
  handleConversationRowClick: (conversation: Conversation) => void,
  logoutHandler: () => void,
}

function Sidebar(props: SidebarProps) {
  return (
    <nav className="Sidebar">
      <SidebarBanner
        handleLaunchConversationCreator={props.handleLaunchConversationCreator}
        logoutHandler={props.logoutHandler} />
      <ConversationList
        conversations={props.conversations}
        selectedConversationUuid={props.selectedConversationUuid}
        handleConversationRowClick={props.handleConversationRowClick} />
    </nav>
  );
}

export default Sidebar;
