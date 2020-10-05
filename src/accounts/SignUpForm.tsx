import React, { ChangeEvent, FormEvent } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Link } from "@reach/router";

import NchatApi from '../utils/NchatApi';

import './SignUpForm.css';

interface SignUpFormProps extends RouteComponentProps {
  authenticateUser: (email: string, password: string) => void,
};

interface SignUpFormState {
  name: string,
  email: string,
  password: string,
}

class SignUpForm extends React.Component<SignUpFormProps, SignUpFormState> {
  state: SignUpFormState = {
    "name": "",
    "email": "",
    "password": "",
  };

  constructor(props: SignUpFormProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({
      [event.target.name]: event.target.value,
    } as Pick<SignUpFormState, keyof SignUpFormState>)
  }

  async handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const requestBody = {
      "name": this.state.name,
      "email": this.state.email,
      "password": this.state.password,
    }

    // try {
    const response = await NchatApi.post("users", requestBody);
    this.props.authenticateUser(this.state.email, this.state.password);

    // } catch (error) {
    //   throw error;
    // }
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
