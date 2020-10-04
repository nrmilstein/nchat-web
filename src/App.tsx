import React from 'react';
import { Router, RouteComponentProps, navigate } from "@reach/router";

import ChatApp from './chatApp/ChatApp'
import AccountsView from './accounts/AccountsView';
import User from './models/User'

import './App.css';

interface AppState {
  user: User | null;
  authKey: string | null;
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    user: null,
    authKey: null,
  };

  constructor(props: RouteComponentProps) {
    super(props);

    this.setAuthenticatedUser = this.setAuthenticatedUser.bind(this);
  }

  componentDidMount() {
    if (this.state.user === null) {
      navigate('/accounts/login');
    }
  }

  setAuthenticatedUser(user: User, authKey: string) {
    this.setState({
      "user": user,
      "authKey": authKey,
    })
  }

  render() {
    return (
      <Router className="Router">
        <ChatApp path="/" user={this.state.user} authKey={this.state.authKey} />
        <AccountsView path="accounts/*" setAuthenticatedUser={this.setAuthenticatedUser} />
      </Router >
    );
  }
}

export default App;
