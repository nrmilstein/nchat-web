import React from 'react';

import SidebarBanner from './SidebarBanner';
import ConversationList from './ConversationList';

import './Sidebar.css'

function Sidebar() {
  return (
    <nav className="Sidebar">
      <SidebarBanner />
      <ConversationList />
    </nav>
  );
}

export default Sidebar;