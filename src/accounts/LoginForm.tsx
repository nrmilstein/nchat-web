import React from 'react';
import { RouteComponentProps } from '@reach/router';
import { Router, Link } from "@reach/router";

import './LoginForm.css'

interface LoginFormProps extends RouteComponentProps {
};

function LoginForm(props: LoginFormProps) {
  return (
    <div className="LoginForm">
      <h1>Login</h1>
      <form onSubmit={e => { e.preventDefault() }}>
        <p><input className="textInput" type="text" placeholder="Email" /></p>
        <p><input className="textInput" type="password" placeholder="Password" /></p>
        <p><input className="button" type="submit" value="Login" /></p>
      </form>
      <div className="LoginForm__signUpMessage">
        Don't have an account? <Link to="../signup">Sign up</Link>
      </div>
    </div >
  );
}

export default LoginForm;