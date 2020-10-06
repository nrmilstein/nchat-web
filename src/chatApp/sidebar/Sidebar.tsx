import React from 'react';
import { RouteComponentProps } from "@reach/router";

import SidebarBanner from './SidebarBanner';
import ConversationStubList from './ConversationStubList';
import User from '../../models/User';
import ConversationStub from '../../models/ConversationStub';

import './Sidebar.css'

interface SidebarProps extends RouteComponentProps {
  conversationStubs: Array<ConversationStub> | null,
  handleConversationStubClick: (conversation: ConversationStub) => void,
}

function Sidebar(props: SidebarProps) {
  return (
    <nav className="Sidebar">
      <SidebarBanner />
      <ConversationStubList conversationStubs={props.conversationStubs}
        handleConversationStubClick={props.handleConversationStubClick} />
    </nav>
  );
}

export default Sidebar;
