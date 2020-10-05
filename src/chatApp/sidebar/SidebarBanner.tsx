import React from 'react';
import { RouteComponentProps } from "@reach/router";
import { UserContext } from '../UserContext';

import User from '../../models/User';

import "./SidebarBanner.css"

interface SidebarBannerProps extends RouteComponentProps {
}

function SidebarBanner(props: SidebarBannerProps) {
  return (
    <UserContext.Consumer>
      {user => <div className="SidebarBanner">{user?.name ?? "Loading user..."}</div>}
    </UserContext.Consumer>
  );
}

export default SidebarBanner;