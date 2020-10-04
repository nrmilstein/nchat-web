import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Router, navigate } from "@reach/router";

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import NchatApi from '../utils/NchatApi';
import User from '../models/User';

import './AccountsView.css'

interface AccountsViewProps extends RouteComponentProps {
  setAuthenticatedUser: (authKey: string, user: User) => void;
}
interface AccountsViewState {
}

class AccountsView extends React.Component<AccountsViewProps, AccountsViewState> {
  constructor(props: AccountsViewProps) {
    super(props);

    this.authenticateUser = this.authenticateUser.bind(this);
  }

  async authenticateUser(email: string, password: string) {
    const requestBody = {
      "email": email,
      "password": password,
    }

    // try {
    const response = await NchatApi.post("authenticate", requestBody);

    const authKey = response.data.authKey;
    const user: User = {
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
    }
    this.props.setAuthenticatedUser(authKey, user);
    // } catch (error) {
    //   throw error;
    // }
    navigate("/");
  }

  render() {
    return (
      <main className="AccountsView">
        <Router>
          <LoginForm path="login" authenticateUser={this.authenticateUser} />
          <SignUpForm path="signup" authenticateUser={this.authenticateUser} />
        </Router>
      </main>
    );
  }
}

export default AccountsView;