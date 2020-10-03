import React, { ChangeEvent, FormEvent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Router, Link } from "@reach/router";

import './LoginForm.css'

interface LoginFormProps extends RouteComponentProps {
};

class LoginForm extends React.Component<LoginFormProps, {}> {
  state = {
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
    })
  }

  handleSubmit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();
  }

  render() {
    return (
      <div className="LoginForm" >
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <p><input className="textInput" type="text" placeholder="Email" required={true} /></p>
          <p><input className="textInput" type="password" placeholder="Password" required={true} /></p>
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