import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Router, navigate } from "@reach/router";

import LoginForm from './LoginForm';
import NchatApi from '../utils/NchatApi';
import { User } from '../models/User';
import { UserJson } from '../utils/json/UserJson';
import TryNowForm from './TryNowForm';
import SignUpForm from './SignUpForm';

import { ReactComponent as NchatLogo } from '../assets/logo.svg';

import styles from './AccountsView.module.css'

interface PostAuthenticateResponse {
  authKey: string,
  user: UserJson,
}

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
      <main className={styles.main}>
        <div className={styles.logoContainer}>
          <NchatLogo className={styles.logo} title="nchat logo" />
        </div>
        <div className={styles.intro}>
          nchat is an app for chatting with your friends.
        </div>
        <div className={styles.selector}>
          <section className={styles.tryNow}>
            <TryNowForm setAuthenticatedUser={this.props.setAuthenticatedUser} />
          </section>
          <div className={styles.divider}>
            or
            </div>
          <section className={styles.authenticate}>
            <Router>
              <SignUpForm path="get-started" authenticateUser={this.authenticateUser} />
              <LoginForm path="login" authenticateUser={this.authenticateUser} />
            </Router>
          </section>
        </div>
      </main>
    );
  }
}

export default AccountsView;