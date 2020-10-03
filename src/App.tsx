import React from 'react';
import { Router, Link, navigate } from "@reach/router";

import ChatApp from './chatApp/ChatApp'
import AccountsView from './accounts/AccountsView';

class App extends React.Component {
  componentDidMount() {
    navigate('/accounts/signup');
  }

  render() {
    return (
      <Router>
        <ChatApp path="/" />
        <AccountsView path="accounts/*" />
      </Router >
    );
  }
}

export default App;
