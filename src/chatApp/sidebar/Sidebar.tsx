import React from 'react';
import { RouteComponentProps } from "@reach/router";

import SidebarBanner from './SidebarBanner';
import ConversationList from './ConversationList';
import { Conversation } from '../../models/Conversation';

import { ReactComponent as LogoutIcon } from './logout.svg';
import { ReactComponent as PlusIcon } from './plus.svg';

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
      <div className="Sidebar__control Sidebar__createConversation">
        <button className="Sidebar__button"
          onClick={props.handleLaunchConversationCreator}>
          <PlusIcon className="Sidebar__icon" title="New Conversation" />
        </button>
      </div>
      <SidebarBanner
        handleLaunchConversationCreator={props.handleLaunchConversationCreator}
        logoutHandler={props.logoutHandler} />
      <ConversationList
        conversations={props.conversations}
        selectedConversationUuid={props.selectedConversationUuid}
        handleConversationRowClick={props.handleConversationRowClick} />
      <div className="Sidebar__control Sidebar__logout">
        <button className="Sidebar__button"
          onClick={props.logoutHandler}>
          <LogoutIcon className="Sidebar__icon" title="Logout" />
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;
