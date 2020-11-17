import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Router, navigate } from "@reach/router";

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import NchatApi from '../utils/NchatApi';
import { UserJson } from '../utils/json/UserJson';

import './AccountsView.css'
import { User } from '../models/User';

interface AccountsViewProps extends RouteComponentProps {
  setAuthenticatedUser: (authKey: string, user: User) => void;
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

  async authenticateUser(username: string, password: string): Promise<void> {
    const requestBody = {
      "username": username,
      "password": password,
    }

    const response = await NchatApi.post<PostAuthenticateResponse>("authenticate", requestBody);

    const authKey = response.data.authKey;
    const user: User = {
      id: response.data.user.id,
      username: response.data.user.username,
      name: response.data.user.name,
    }
    this.props.setAuthenticatedUser(authKey, user);
    navigate("/");
  }

  render() {
    return (
      <main className="AccountsView">
        <div className="AccountsView__logoContainer">
          <img className="AccountsView__logo" src="/img/logo.svg" alt="nchat logo" />
        </div>
        <Router>
          <LoginForm path="login" authenticateUser={this.authenticateUser} />
          <SignUpForm path="signup" authenticateUser={this.authenticateUser} />
        </Router>
      </main>
    );
  }
}

export default AccountsView;