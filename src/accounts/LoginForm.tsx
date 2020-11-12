import React, { ChangeEvent, FormEvent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Link } from "@reach/router";

import './LoginForm.css';
import '../misc/LoadingIcon.css';

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
  status: LoginFormStatus,
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
  state: LoginFormState = {
    username: '',
    password: '',
    status: LoginFormStatus.Empty,
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
      status: LoginFormStatus.Loading,
    });

    try {
      await this.props.authenticateUser(this.state.username, this.state.password);
    } catch (error) {
      this.setState({
        status: LoginFormStatus.Error,
      });
    }
  }

  render() {
    let status: JSX.Element | null;

    switch (this.state.status) {
      case LoginFormStatus.Empty:
        status = null;
        break;
      case LoginFormStatus.Loading:
        status = <div className="LoginForm__loading LoadingIcon"></div>;
        break;
      case LoginFormStatus.Error:
        status =
          <div className="errorMessage">
            The username or password you entered doesn't match our records. Please try again.
          </div>
        break;
    }

    return (
      <div className="LoginForm" >
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <p><input className="textInput" name="username" type="text" placeholder="Username"
            value={this.state.username} onChange={this.handleChange} required={true}
            autoFocus={true} /></p>
          <p><input className="textInput" name="password" type="password" placeholder="Password"
            value={this.state.password} onChange={this.handleChange} required={true} /></p>
          <p><input className="button" type="submit" value="Login" /></p>
        </form>
        <div className="LoginForm__signUpMessage">
          Don't have an account? <Link to="../signup">Sign up</Link>
        </div>
        <div className="LoginForm__status">
          {status}
        </div>
      </div >
    );
  }
}

export default LoginForm;
