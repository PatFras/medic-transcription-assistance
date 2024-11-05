import type { AppProps } from 'next/app';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsconfig from '@/amplify_outputs.json'; 
import '@aws-amplify/ui-react/styles.css';
import ScriptLoader from './../components/ScriptLoader';

Amplify.configure(awsconfig);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
          <ScriptLoader/>
          <Component {...pageProps} />
        </main>
      )}
    </Authenticator>
  );
}
