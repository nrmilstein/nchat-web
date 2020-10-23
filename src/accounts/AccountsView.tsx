import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Router, navigate } from "@reach/router";

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import NchatApi from '../utils/NchatApi';
import { UserJson } from '../utils/json/UserJson';

import './AccountsView.css'
import { SyncedUser } from '../models/User';

interface AccountsViewProps extends RouteComponentProps {
  setAuthenticatedUser: (authKey: string, user: SyncedUser) => void;
}

interface AccountsViewState {
}

interface PostAuthenticateResponse {
  authKey: string,
  user: UserJson,
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
    const response = await NchatApi.post<PostAuthenticateResponse>("authenticate", requestBody);

    const authKey = response.data.authKey;
    const user: SyncedUser = {
      id: response.data.user.id,
      email: response.data.user.email,
      name: response.data.user.name,
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