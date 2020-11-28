import React from 'react';
import { RouteComponentProps } from "@reach/router";

import { ChatAppContext } from '../ChatAppContext';

import { ReactComponent as LogoutIcon } from './logout.svg';
import { ReactComponent as PlusIcon } from './plus.svg';

import styles from "./SidebarBanner.module.css"

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
            <header className={styles.main}>
              <div className={styles.userName}>
                {context.user.name ?? context.user.username}
              </div>
              <button className={styles.button}
                onClick={props.logoutHandler}>
                <LogoutIcon className={styles.icon} title="Logout" />
              </button>
              <button className={styles.button}
                onClick={props.handleLaunchConversationCreator}>
                <PlusIcon className={styles.icon} title="New conversation" />
              </button>
            </header>
          )
        }
      }
    </ChatAppContext.Consumer >
  );
}

export default SidebarBanner;