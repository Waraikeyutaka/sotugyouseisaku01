import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
export default function App() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'めし';
    }
  }, []);
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <AppNavigator />
    </NavigationContainer>
  );
}