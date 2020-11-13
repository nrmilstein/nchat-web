import React from 'react';
import { Router, navigate } from "@reach/router";

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
  }

  componentDidMount() {
    if (this.state.authKey === null && window.location.pathname === "/") {
      navigate('/accounts/login');
    }
  }

  setAuthenticatedUser(authKey: string, user: User) {
    this.setState({
      "authKey": authKey,
      "user": user,
    })
  }

  render() {
    return (
      <Router className="Router">
        {this.state.authKey !== null &&
          <ChatAppLoader path="/"
            authKey={this.state.authKey}
            user={this.state.user}
            key={this.state.user?.id} />}
        <AccountsView path="accounts/*" setAuthenticatedUser={this.setAuthenticatedUser} />
      </Router >
    );
  }
}

export default App;
