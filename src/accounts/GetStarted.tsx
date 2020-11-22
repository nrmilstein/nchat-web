import React from 'react';
import { RouteComponentProps } from '@reach/router';

import { User } from '../models/User';
import SignUpForm from './SignUpForm';
import TryNowForm from './TryNowForm';

import './GetStarted.css';

interface GetStartedProps extends RouteComponentProps {
  authenticateUser: (username: string, password: string) => Promise<void>,
  setAuthenticatedUser: (authKey: string, user: User) => void,
}

function GetStarted(props: GetStartedProps) {
  return (
    <div className="GetStarted">
      <div className="GetStarted__selector">
        <section className="GetStarted__tryNow">
          <TryNowForm setAuthenticatedUser={props.setAuthenticatedUser} />
        </section>
        <div className="GetStarted__divider">
          or
        </div>
        <section className="GetStarted__signUp">
          <SignUpForm authenticateUser={props.authenticateUser} />
        </section>
      </div>
    </div>
  );
}

export default GetStarted