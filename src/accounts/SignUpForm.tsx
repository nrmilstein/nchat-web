import React, { ChangeEvent, FormEvent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Link } from "@reach/router";

import NchatApi, { NchatApiError } from '../utils/NchatApi';

import './SignUpForm.css';
import '../assets/LoadingIcon.css';

enum SignUpFormStatus {
  Empty,
  Loading,
  Error,
}

interface SignUpFormProps extends RouteComponentProps {
  authenticateUser: (username: string, password: string) => Promise<void>,
};

interface SignUpFormState {
  name: string,
  username: string,
  password: string,
  status: {
    value: SignUpFormStatus,
    message?: string,
  },
}

class SignUpForm extends React.Component<SignUpFormProps, SignUpFormState> {
  state: SignUpFormState = {
    "name": "",
    "username": "",
    "password": "",
    status: {
      value: SignUpFormStatus.Empty,
    },
  };

  constructor(props: SignUpFormProps) {
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
      case "name":
        this.setState({
          name: event.target.value,
        });
        break;
    }
  }

  async handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    this.setState({
      status: {
        value: SignUpFormStatus.Loading
      },
    });

    const requestBody = {
      "name": this.state.name,
      "username": this.state.username,
      "password": this.state.password,
    }

    try {
      await NchatApi.post("users", requestBody);
    } catch (error) {
      if (error instanceof NchatApiError && error.body.code === 6) {
        this.setState({
          status: {
            value: SignUpFormStatus.Error,
            message: "That username is already taken. Please select another username.",
          },
        });
      } else {
        this.setState({
          status: {
            value: SignUpFormStatus.Error,
            message: "Could not sign up. Please try again later.",
          },
        });
      }
      return;
    }

    try {
      await this.props.authenticateUser(this.state.username, this.state.password);
    } catch (error) {
      this.setState({
        status: {
          value: SignUpFormStatus.Error,
          message: `Error logging in: account created but could not login.
           Please try logging in again later.`,
        },
      });
      return;
    }
  }

  render() {
    let status: JSX.Element | null;

    switch (this.state.status.value) {
      case SignUpFormStatus.Empty:
        status = null;
        break;
      case SignUpFormStatus.Loading:
        status = <div className="SignUpForm__loading LoadingIcon"></div>;
        break;
      case SignUpFormStatus.Error:
        status =
          <div className="errorMessage">
            {this.state.status.message}
          </div>
        break;
    }

    return (
      <div className="SignUpForm" >
        <h1 className="AccountsView__accountsHeader">Sign up</h1>
        <form onSubmit={this.handleSubmit}>
          <p><input className="textInput" name="name" type="text" placeholder="Display name"
            value={this.state.name} onChange={this.handleChange} required={true}
            autoFocus={true} /></p>
          <p><input className="textInput" name="username" type="text" placeholder="Username"
            value={this.state.username} onChange={this.handleChange} required={true} /></p>
          <p><input className="textInput" name="password" type="password" placeholder="Password"
            value={this.state.password} onChange={this.handleChange} required={true} /></p>
          <p><input className="button" type="submit" value="Sign up" /></p>
        </form>
        <div className="SignUpForm__loginMessage">
          Already have an account? <Link to="../login">Login</Link>
        </div>
        <div className="SignUpForm__status">
          {status}
        </div>
      </div >
    );
  }
}

export default SignUpForm;
