import React from 'react';
import { RouteComponentProps } from "@reach/router";

import { ChatAppContext } from '../ChatAppContext';

import { ReactComponent as LogoutIcon } from './logout.svg';
import { ReactComponent as PlusIcon } from './plus.svg';

import "./SidebarBanner.css"

interface SidebarBannerProps extends RouteComponentProps {
  handleLaunchConversationCreator: () => void,
  logoutHandler: () => void,
}

function SidebarBanner(props: SidebarBannerProps) {
  return (
    <ChatAppContext.Consumer>
      {
        context => {
          return (
            <header className="SidebarBanner">
              <div className="SidebarBanner__userName">
                {context.user.name ?? context.user.username}
              </div>
              <button className="SidebarBanner__button"
                onClick={props.logoutHandler}>
                <LogoutIcon className="SidebarBanner__icon" title="Logout" />
              </button>
              <button className="SidebarBanner__button"
                onClick={props.handleLaunchConversationCreator}>
                <PlusIcon className="SidebarBanner__icon" title="New conversation" />
              </button>
            </header>
          )
        }
      }
    </ChatAppContext.Consumer >
  );
}

export default SidebarBanner;