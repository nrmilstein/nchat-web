import React from 'react';
import { RouteComponentProps } from "@reach/router";

import User from '../../models/User';

import "./SidebarBanner.css"

interface SidebarBannerProps extends RouteComponentProps {
  user: User | null,
}

function SidebarBanner(props: SidebarBannerProps) {
  return (
    <div className="SidebarBanner">{props.user?.name ?? "Loading user..."}</div>
  );
}

export default SidebarBanner;