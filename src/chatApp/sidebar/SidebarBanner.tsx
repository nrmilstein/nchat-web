import React from 'react';
import { RouteComponentProps } from "@reach/router";

import { ChatAppContext } from '../ChatAppContext';

import "./SidebarBanner.css"

interface SidebarBannerProps extends RouteComponentProps {
  handleNewChat: () => void,
}

function SidebarBanner(props: SidebarBannerProps) {
  return (
    <ChatAppContext.Consumer>
      {
        context => {
          return (
            <header className="SidebarBanner">
              <div className="SidebarBanner__userName">
                {context.user.name ?? ""}
              </div>
              <button className="SidebarBanner__plus">＋</button>
            </header>
          )
        }
      }
    </ChatAppContext.Consumer>
  );
}

export default SidebarBanner;