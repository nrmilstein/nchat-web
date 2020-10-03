import React, { ChangeEvent, FormEvent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Router, Link } from "@reach/router";

import './SignUpForm.css'

interface SignUpFormProps extends RouteComponentProps {
};

class SignUpForm extends React.Component<SignUpFormProps, {}> {
  state = {
    'name': '',
    'email': '',
    'password': '',
  };

  constructor(props: SignUpFormProps) {
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
    // fetch()
    event.preventDefault();
  }

  render() {
    return (
      <div className="SignUpForm" >
        <h1>Sign up</h1>
        <form onSubmit={this.handleSubmit}>
          <p><input className="textInput" name="name" type="text" placeholder="Display name"
            value={this.state.name} onChange={this.handleChange} required={true} /></p>
          <p><input className="textInput" name="email" type="text" placeholder="Email"
            value={this.state.email} onChange={this.handleChange} required={true} /></p>
          <p><input className="textInput" name="password" type="password" placeholder="Password"
            value={this.state.password} onChange={this.handleChange} required={true} /></p>
          <p><input className="button" type="submit" value="Sign up" /></p>
        </form>
        <div className="SignUpForm__loginMessage">
          Already have an account? <Link to="../login">Login</Link>
        </div>
      </div >
    );
  }
}

export default SignUpForm;