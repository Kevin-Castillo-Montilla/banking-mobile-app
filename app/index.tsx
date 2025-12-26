import { useState } from 'react';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Splash from "./src/screens/Splash";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<'login' | 'register'>('login');

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  if (screen === 'login') {
    return (
      <Login 
        onNavigateToRegister={() => setScreen('register')}
      />
    );
  }

  return (
    <Register 
      onNavigateToLogin={() => setScreen('login')}
    />
  );
}
