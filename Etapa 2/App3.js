import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, TextInput, FlatList } from 'react-native';
import List from './components/List.js';

import Inputs from './components/Inputs.js';

export default function App() {
 
  return (
    <View style={styles.container}>
     <Inputs />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 600,
    marginTop:150,
  },
});
