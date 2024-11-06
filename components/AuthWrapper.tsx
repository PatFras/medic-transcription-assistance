import { FC, ReactNode } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper: FC<AuthWrapperProps> = ({ children }) => (
  <Authenticator>
    {({ signOut, user }) => (
      <main>
        <h1>Hello {user?.username}</h1>
        <button onClick={signOut}>Sign out</button>
        {children}
      </main>
    )}
  </Authenticator>
);

export default AuthWrapper;
