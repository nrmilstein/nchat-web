import React from 'react';
import { Router } from "@reach/router";
import Cookies from 'universal-cookie';

import ChatAppLoader from './chatApp/ChatAppLoader';
import AccountsView from './accounts/AccountsView';
import { User } from './models/User'

import './App.css';

interface AppState {
  authKey: string | null,
  user: User | null,
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    authKey: null,
    user: null,
  };

  constructor(props: {}) {
    super(props);

    this.setAuthenticatedUser = this.setAuthenticatedUser.bind(this);
    this.logout = this.logout.bind(this);

    const cookies = new Cookies();
    const authKey = cookies.get("authKey");
    if (authKey) {
      this.state.authKey = authKey;
    }
  }

  componentDidMount() {
  }

  setAuthenticatedUser(authKey: string, user: User) {
    const cookies = new Cookies();
    cookies.set("authKey", authKey, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });

    this.setState({
      "authKey": authKey,
      "user": user,
    })
  }

  logout() {
    const cookies = new Cookies();
    cookies.remove("authKey", { path: "/" });
    this.setState({
      authKey: null,
      user: null,
    });
  }

  render() {
    return (
      <Router className="Router">
        <ChatAppLoader path="/"
          authKey={this.state.authKey}
          user={this.state.user}
          key={this.state.user?.id}
          logoutHandler={this.logout} />
        <AccountsView path="accounts/*" setAuthenticatedUser={this.setAuthenticatedUser} />
      </Router >
    );
  }
}

export default App;
