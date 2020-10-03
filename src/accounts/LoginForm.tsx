import React from 'react';
import './LoginForm.css'

interface LoginFormProps {
  onSwitchForm: (e: React.MouseEvent<HTMLAnchorElement>, showLoginForm: boolean) => void
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
        Don't have an account? <a onClick={e => props.onSwitchForm(e, false)} href="#">Sign up</a>
      </div>
    </div>
  );
}

export default LoginForm;