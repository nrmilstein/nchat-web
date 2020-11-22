import React, { MouseEvent } from 'react';
import { navigate } from '@reach/router';

import NchatApi from '../utils/NchatApi';
import { User } from '../models/User';
import { UserJson } from '../utils/json/UserJson';

import "./TryNowForm.css";

enum TryNowFormStatus {
  Empty,
  Loading,
  Error,
}

interface PostDemoUsersResponse {
  authKey: string,
  user: UserJson,
}

interface TryNowFormProps {
  setAuthenticatedUser: (authKey: string, user: User) => void;
}

interface TryNowFormState {
  status: {
    value: TryNowFormStatus,
    message?: string,
  },
}

class TryNowForm extends React.Component<TryNowFormProps, TryNowFormState> {
  state: TryNowFormState = {
    status: {
      value: TryNowFormStatus.Empty,
    },
  };

  constructor(props: TryNowFormProps) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick(event: MouseEvent<HTMLButtonElement>) {
    this.setState({
      status: {
        value: TryNowFormStatus.Loading,
      },
    });

    const response = await NchatApi.post<PostDemoUsersResponse>("demoUsers", {});

    const authKey = response.data.authKey;
    const user: User = {
      id: response.data.user.id,
      username: response.data.user.username,
      name: response.data.user.name,
    }

    this.props.setAuthenticatedUser(authKey, user);
    navigate("/")
  }

  render() {
    let status: JSX.Element | null;

    switch (this.state.status.value) {
      case TryNowFormStatus.Empty:
        status = null;
        break;
      case TryNowFormStatus.Loading:
        status = <div className="TryNowForm__loading LoadingIcon"></div>;
        break;
      case TryNowFormStatus.Error:
        status =
          <div className="errorMessage">
            {this.state.status.message}
          </div>
        break;
    }

    return (
      <div className="TryNowForm">
        <h1 className="AccountsView__accountsHeader">Try now!</h1>
        <p>
          Try a demo of nchat now.
        </p>
        <button className="button" onClick={this.handleClick}>Try it now →</button>
        <div className="TryNowForm__status">
          <p>
            {status}
          </p>
        </div>
      </div>
    );
  }
}

export default TryNowForm;