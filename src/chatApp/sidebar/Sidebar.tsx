import React from 'react';
import {RouteComponentProps} from "@reach/router";

import SidebarBanner from './SidebarBanner';
import ConversationList from './ConversationList';
import User from '../../models/User';
import ConversationStub from '../../models/ConversationStub';

import './Sidebar.css'

interface SidebarProps extends RouteComponentProps {
  user: User | null,
  conversations: Array<ConversationStub> | null,
}

function Sidebar(props: SidebarProps) {
  return (
    <nav className="Sidebar">
      <SidebarBanner user={props.user} />
      <ConversationList conversations={props.conversations} />
    </nav>
  );
}

export default Sidebar;
