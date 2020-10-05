import React from 'react';
import { RouteComponentProps } from "@reach/router";

import SidebarBanner from './SidebarBanner';
import ConversationStubList from './ConversationStubList';
import User from '../../models/User';
import ConversationStub from '../../models/ConversationStub';

import './Sidebar.css'

interface SidebarProps extends RouteComponentProps {
  user: User | null,
  conversations: Array<ConversationStub> | null,
  handleConversationStubClick: (conversation: ConversationStub) => void,
}

function Sidebar(props: SidebarProps) {
  return (
    <nav className="Sidebar">
      <SidebarBanner user={props.user} />
      <ConversationStubList conversations={props.conversations}
        handleConversationStubClick={props.handleConversationStubClick} />
    </nav>
  );
}

export default Sidebar;
