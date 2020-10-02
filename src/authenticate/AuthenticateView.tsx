import React from 'react';
import './AuthenticateView.css'

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

interface AuthenticateViewProps {

}
interface AuthenticateViewState {
  showLoginForm: boolean,
}

class AuthenticateView extends React.Component<AuthenticateViewProps, AuthenticateViewState> {
  state: AuthenticateViewState = {
    showLoginForm: true,
  };

  constructor(props: AuthenticateViewProps) {
    super(props);
    this.handleSwitchForm = this.handleSwitchForm.bind(this);
  }

  handleSwitchForm(e: React.MouseEvent<HTMLAnchorElement>, showLoginForm: boolean) {
    this.setState({ 'showLoginForm': showLoginForm });
    e.preventDefault();
  }

  render() {
    return (
      <main className="AuthenticateView">
        { this.state.showLoginForm
          ? <LoginForm onSwitchForm={this.handleSwitchForm} />
          : <SignUpForm onSwitchForm={this.handleSwitchForm} />
        }
      </main>
    );
  }
}

export default AuthenticateView;