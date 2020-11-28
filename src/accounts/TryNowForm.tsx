import React, { MouseEvent } from 'react';
import { navigate } from '@reach/router';

import NchatApi from '../utils/NchatApi';
import { User } from '../models/User';
import { UserJson } from '../utils/json/UserJson';

import styles from "./TryNowForm.module.css";
import loadingIconStyles from '../assets/LoadingIcon.module.css';

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

    try {
      const response = await NchatApi.post<PostDemoUsersResponse>("demoUsers", {});

      const authKey = response.data.authKey;
      const user: User = {
        id: response.data.user.id,
        username: response.data.user.username,
        name: response.data.user.name,
      }

      this.props.setAuthenticatedUser(authKey, user);
      navigate("/")
    } catch (error) {
      this.setState({
        status: {
          value: TryNowFormStatus.Error,
          message: "Could not launch demo. Please try again later.",
        },
      });
    }
  }

  render() {
    let status: JSX.Element | null;

    switch (this.state.status.value) {
      case TryNowFormStatus.Empty:
        status = null;
        break;
      case TryNowFormStatus.Loading:
        status = <div className={styles.loading + " " + loadingIconStyles.main}></ div>;
        break;
      case TryNowFormStatus.Error:
        status =
          <div className="errorMessage">
            {this.state.status.message}
          </div>
        break;
    }

    return (
      <div className={styles.main}>
        <h1 className={styles.header}>Try now!</h1>
        <p>
          Try a demo of nchat now.
        </p>
        <button className="button" onClick={this.handleClick}>Try it now →</button>
        <div className={styles.status}>
          <p>
            {status}
          </p>
        </div>
      </div>
    );
  }
}

export default TryNowForm;