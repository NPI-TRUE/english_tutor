import React from 'react';
import App from './App';
import Login from './Login.tsx';

const AuthWrapper: React.FC = () => {
  const sessionCookie = document.cookie.split('; ').find(row => row.startsWith('session_id='));

  if (sessionCookie) {
    return <App />;
  } else {
    return <Login />;
  }
};

export default AuthWrapper;