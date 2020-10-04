import React, { ChangeEvent, FormEvent } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { Link } from "@reach/router";

import NchatApi from '../utils/NchatApi';
import User from '../models/User';

import './LoginForm.css';

interface LoginFormProps extends RouteComponentProps {
  setAuthenticatedUser: (user: User, authKey: string) => void;
};

interface LoginFormState {
  email: string,
  password: string,
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
  state: LoginFormState = {
    email: '',
    password: '',
  };

  constructor(props: LoginFormProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({
      [event.target.name]: event.target.value,
    } as Pick<LoginFormState, keyof LoginFormState>);
  }

  async handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const requestBody = {
      "email": this.state.email,
      "password": this.state.password,
    }

    try {
      const response = await NchatApi.post("authenticate", requestBody);
      const authenticatedUser: User = {
        "id": response.data.user.id,
        "name": response.data.user.name,
        "email": response.data.user.email
      }
      const authKey = response.data.authKey;
      this.props.setAuthenticatedUser(authenticatedUser, authKey);

      navigate("/");
    } catch (error) {
      throw error;
    }
  }

  render() {
    return (
      <div className="LoginForm" >
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <p><input className="textInput" name="email" type="text" placeholder="Email"
            value={this.state.email} onChange={this.handleChange} required={true} /></p>
          <p><input className="textInput" name="password" type="password" placeholder="Password"
            value={this.state.password} onChange={this.handleChange} required={true} /></p>
          <p><input className="button" type="submit" value="Login" /></p>
        </form>
        <div className="LoginForm__signUpMessage">
          Don't have an account? <Link to="../signup">Sign up</Link>
        </div>
      </div >
    );
  }
}

export default LoginForm;