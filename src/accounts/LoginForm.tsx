import React, { ChangeEvent, FormEvent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Link } from "@reach/router";

import './LoginForm.css';

interface LoginFormProps extends RouteComponentProps {
  authenticateUser: (username: string, password: string) => void,
};

interface LoginFormState {
  username: string,
  password: string,
}

class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
  state: LoginFormState = {
    username: '',
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

    this.props.authenticateUser(this.state.username, this.state.password);
  }

  render() {
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
      </div >
    );
  }
}

export default LoginForm;
