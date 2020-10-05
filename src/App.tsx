import React from 'react';
import { Router, RouteComponentProps, navigate } from "@reach/router";

import ChatApp from './chatApp/ChatApp'
import AccountsView from './accounts/AccountsView';
import User from './models/User'

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

  constructor(props: RouteComponentProps) {
    super(props);

    this.setAuthenticatedUser = this.setAuthenticatedUser.bind(this);
  }

  componentDidMount() {
    if (this.state.authKey === null) {
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
          < ChatApp path="/" authKey={this.state.authKey} initialUser={this.state.user} />}
        <AccountsView path="accounts/*" setAuthenticatedUser={this.setAuthenticatedUser} />
      </Router >
    );
  }
}

export default App;
