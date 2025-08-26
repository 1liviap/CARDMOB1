import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { ThemeProvider } from './scr/contexts/ThemeContext'; // NOVA
import RootNavigator from './scr/navigation/RootNavigator';
import { AuthProvider } from './scr/contexts/AuthContext';


export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});