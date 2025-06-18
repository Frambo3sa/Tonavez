// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import AuthStack from './screens/AuthStack';
import MainTabs from './screens/MainTabs';

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => onAuthStateChanged(auth, usr => {
    setUser(usr);
    if (initializing) setInitializing(false);
  }), []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      {user ? <MainTabs user={user}/> : <AuthStack />}
    </NavigationContainer>
  );
}
