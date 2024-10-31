import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsconfig from '@/amplify_outputs.json'; // Asegúrate de que la ruta a tu archivo de configuración sea correcta
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsconfig);

const HomePage = () => {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
          <p>Welcome to the homepage!</p>
        </main>
      )}
    </Authenticator>
  );
};

export default HomePage;
