import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Router } from "@reach/router";

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

import './AccountsView.css'
import User from '../models/User';

interface AccountsViewProps extends RouteComponentProps {
  setAuthenticatedUser: (user: User, authKey: string) => void;
}
interface AccountsViewState {
  showLoginForm: boolean,
}

class AccountsView extends React.Component<AccountsViewProps, AccountsViewState> {
  state: AccountsViewState = {
    showLoginForm: true,
  };

  render() {
    return (
      <main className="AccountsView">
        <Router>
          <LoginForm path="login" setAuthenticatedUser={this.props.setAuthenticatedUser} />
          <SignUpForm path="signup" setAuthenticatedUser={this.props.setAuthenticatedUser} />
        </Router>
      </main>
    );
  }
}

export default AccountsView;