import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Router, Link } from "@reach/router";

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

import './AccountsView.css'

interface AccountsViewProps extends RouteComponentProps {

}
interface AccountsViewState {
  showLoginForm: boolean,
}

class AccountsView extends React.Component<AccountsViewProps, AccountsViewState> {
  state: AccountsViewState = {
    showLoginForm: true,
  };

  constructor(props: AccountsViewProps) {
    super(props);
  }

  render() {
    return (
      <main className="AccountsView">
        <Router>
          <LoginForm path="login" />
          <SignUpForm path="signup" />
        </Router>
      </main>
    );
  }
}

export default AccountsView;