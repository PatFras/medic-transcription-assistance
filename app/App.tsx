import type { AppProps } from 'next/app';
import ScriptLoader from './../components/ScriptLoader';
import AuthWrapper from './../components/AuthWrapper';
import '../configureAmplify';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthWrapper>
      <ScriptLoader/>
      <Component {...pageProps} />
    </AuthWrapper>
  );
}
