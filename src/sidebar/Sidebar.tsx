import React from 'react';

import SidebarHeader from './SidebarHeader';
import ConversationList from './ConversationList';

import './Sidebar.css'

function Sidebar() {
  return (
    <nav className="Sidebar">
      <SidebarHeader />
      <ConversationList />
    </nav>
  );
}

export default Sidebar;