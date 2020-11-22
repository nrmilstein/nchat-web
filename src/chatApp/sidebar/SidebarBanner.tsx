import React, { MouseEvent } from 'react';
import { RouteComponentProps } from "@reach/router";

import { ChatAppContext } from '../ChatAppContext';

import "./SidebarBanner.css"

interface SidebarBannerProps extends RouteComponentProps {
  handleLaunchConversationCreator: () => void,
  logoutHandler: () => void,
}

class SidebarBanner extends React.Component<SidebarBannerProps, {}> {
  constructor(props: SidebarBannerProps) {
    super(props);

    this.logoutHandler = this.logoutHandler.bind(this);
  }

  logoutHandler(event: MouseEvent<HTMLButtonElement>) {
    this.props.logoutHandler();
  }

  render() {
    return (
      <ChatAppContext.Consumer>
        {
          context => {
            return (
              <header className="SidebarBanner">
                <div className="SidebarBanner__userName">
                  {context.user.name ?? context.user.username}
                </div>
                <button className="SidebarBanner__button" onClick={this.props.logoutHandler}>
                  <img className="SidebarBanner__icon" src="/img/logout.svg" alt="settings"
                    title="Logout" />
                </button>
                <button className="SidebarBanner__button"
                  onClick={this.props.handleLaunchConversationCreator}>
                  <img className="SidebarBanner__icon" src="/img/plus.svg" alt="New conversation"
                    title="New conversation" />
                </button>
              </header>
            )
          }
        }
      </ChatAppContext.Consumer >
    );
  }
}

export default SidebarBanner;