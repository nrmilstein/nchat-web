import React from 'react';
import { RouteComponentProps } from "@reach/router";
import { ChatAppContext } from '../ChatAppContext';

import User from '../../models/User';

import "./SidebarBanner.css"

interface SidebarBannerProps extends RouteComponentProps {
}

function SidebarBanner(props: SidebarBannerProps) {
  return (
    <ChatAppContext.Consumer>
      {
        context => {
          return <div className="SidebarBanner">{context.user?.name ?? ""}</div>
        }
      }
    </ChatAppContext.Consumer>
  );
}

export default SidebarBanner;