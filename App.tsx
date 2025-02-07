/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import BottomNavigation from './src/navigation/BottomNavigation';
import { Provider } from 'react-redux';
import store from './src/redux/Store';

function App(): React.JSX.Element {

  return (
    <SafeAreaView style={[styles.container]}>
      <Provider store={store}>
        <BottomNavigation />
      </Provider>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  }
});


export default App;
