import React, { ChangeEvent, FormEvent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Link } from "@reach/router";
import { NchatApiError } from '../utils/NchatApi';

import styles from './LoginForm.module.css';
import loadingIconStyles from '../assets/LoadingIcon.module.css';

enum LoginFormStatus {
  Empty,
  Loading,
  Error,
}

interface LoginFormProps extends RouteComponentProps {
  authenticateUser: (username: string, password: string) => Promise<void>,
};

interface LoginFormState {
  username: string,
  password: string,
  status: {
    value: LoginFormStatus,
    message?: string,
  },
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
  state: LoginFormState = {
    username: '',
    password: '',
    status: {
      value: LoginFormStatus.Empty,
    }
  };

  constructor(props: LoginFormProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    switch (event.target.name) {
      case "username":
        this.setState({
          username: event.target.value,
        });
        break;
      case "password":
        this.setState({
          password: event.target.value,
        });
        break;
    }
  }

  async handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    this.setState({
      status: {
        value: LoginFormStatus.Loading,
      }
    });

    try {
      await this.props.authenticateUser(this.state.username, this.state.password);
    } catch (error) {
      if (error instanceof NchatApiError && error.body.code === 1) {
        this.setState({
          status: {
            value: LoginFormStatus.Error,
            message: "The username or password you entered doesn't match our records. Please try again.",
          },
        });
      } else {
        this.setState({
          status: {
            value: LoginFormStatus.Error,
            message: "Could not login. Please try again later.",
          },
        });
      }
    }
  }

  render() {
    const autoFocus = window.matchMedia("(min-width: 700px)").matches;

    let status: JSX.Element | null;
    switch (this.state.status.value) {
      case LoginFormStatus.Empty:
        status = null;
        break;
      case LoginFormStatus.Loading:
        status = <div className={styles.loading + " " + loadingIconStyles.main}></div>;
        break;
      case LoginFormStatus.Error:
        status =
          <div className="errorMessage">
            {this.state.status.message}
          </div>
        break;
    }

    return (
      <div className={styles.main} >
        <h1 className={styles.header}>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <p><input className="textInput" name="username" type="text" placeholder="Username"
            value={this.state.username} onChange={this.handleChange} required={true}
            autoFocus={autoFocus} /></p>
          <p><input className="textInput" name="password" type="password" placeholder="Password"
            value={this.state.password} onChange={this.handleChange} required={true} /></p>
          <p><input className="button" type="submit" value="Login" /></p>
        </form>
        <div className={styles.signUpMessage}>
          Don't have an account? <Link to="../get-started">Sign up</Link>
        </div>
        <div className={styles.status}>
          {status}
        </div>
      </div >
    );
  }
}

export default LoginForm;
