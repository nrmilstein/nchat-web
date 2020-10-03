import React from 'react';
import './AccountsView.css'

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

interface AccountsViewProps {

}
interface AccountsViewState {
  showLoginForm: boolean,
}

class AccountsView extends React.Component<AccountsViewProps, AccountsViewState> {
  state: AccountsViewState = {
    showLoginForm: true,
  };

  constructor(props: AccountsViewProps) {
    super(props);
    this.handleSwitchForm = this.handleSwitchForm.bind(this);
  }

  handleSwitchForm(e: React.MouseEvent<HTMLAnchorElement>, showLoginForm: boolean) {
    this.setState({ 'showLoginForm': showLoginForm });
    e.preventDefault();
  }

  render() {
    return (
      <main className="AccountsView">
        { this.state.showLoginForm
          ? <LoginForm onSwitchForm={this.handleSwitchForm} />
          : <SignUpForm onSwitchForm={this.handleSwitchForm} />
        }
      </main>
    );
  }
}

export default AccountsView;