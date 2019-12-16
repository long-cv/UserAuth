/**
 * Sample user authentication
 *
 * @format
 * @flow
 */

import React from 'react';
import {View, StatusBar} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {reducers} from './redux/export';
import {
  AppLoadingContainer,
  LoginContainer,
  SignupContainer,
  ProfileContainer,
  ProfileUpdateContainer,
} from './src/export_src';

const _appStack = createStackNavigator({
  profile: {
    screen: ProfileContainer,
    navigationOptions: {
      header: null,
    },
  },
  profileUpdate: {
    screen: ProfileUpdateContainer,
    navigationOptions: {
      header: null,
    },
  },
});
const _authStatck = createStackNavigator(
  {
    login: {
      screen: LoginContainer,
    },
    signup: {
      screen: SignupContainer,
    },
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);
const _AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      appLoading: AppLoadingContainer,
      app: _appStack,
      auth: _authStatck,
    },
    {
      initialRouteName: 'appLoading',
    },
  ),
);
const store = createStore(reducers);
//console.log('___________________________ start app, store = ', store);
const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" />
      <View style={{flex: 1}}>
        <_AppContainer />
      </View>
    </Provider>
  );
};

export default App;
