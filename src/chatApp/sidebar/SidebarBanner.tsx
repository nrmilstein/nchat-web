import React from 'react';
import { RouteComponentProps } from "@reach/router";

import { ChatAppContext } from '../ChatAppContext';

import "./SidebarBanner.css"

interface SidebarBannerProps extends RouteComponentProps {
}

function SidebarBanner(props: SidebarBannerProps) {
  return (
    <ChatAppContext.Consumer>
      {
        context => {
          return <header className="SidebarBanner">{context.user.name ?? ""}</header>
        }
      }
    </ChatAppContext.Consumer>
  );
}

export default SidebarBanner;