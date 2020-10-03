import React from 'react';
import { Router, Link } from "@reach/router";

import ChatApp from './chatApp/ChatApp'
import AccountsView from './accounts/AccountsView';

function App() {
  return (
    <Router>
      <ChatApp path="/" />
      <AccountsView path="accounts/*" />
    </Router >
  );
}

export default App;
