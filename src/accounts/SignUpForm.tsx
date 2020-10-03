import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Router, Link } from "@reach/router";

import './SignUpForm.css'

interface SignUpFormProps extends RouteComponentProps {
};

function SignUpForm(props: SignUpFormProps) {
  return (
    <div className="SignUpForm">
      <h1>Sign up</h1>
      <form onSubmit={e => { e.preventDefault() }}>
        <p><input className="textInput" type="text" placeholder="Display name" /></p>
        <p><input className="textInput" type="text" placeholder="Email" /></p>
        <p><input className="textInput" type="password" placeholder="Password" /></p>
        <p><input className="button" type="submit" value="Sign up" /></p>
      </form>
      <div className="SignUpForm__loginMessage">
        Already have an account? <Link to="../login">Login</Link>
      </div>
    </div>
  );
}

export default SignUpForm;