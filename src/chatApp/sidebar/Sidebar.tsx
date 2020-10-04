import React from 'react';
import { RouteComponentProps } from "@reach/router";

import SidebarBanner from './SidebarBanner';
import ConversationList from './ConversationList';
import User from '../../models/User';

import './Sidebar.css'

interface SidebarProps extends RouteComponentProps {
  user: User,
}

function Sidebar(props: SidebarProps) {
  return (
    <nav className="Sidebar">
      <SidebarBanner user={props.user} />
      <ConversationList />
    </nav>
  );
}

export default Sidebar;