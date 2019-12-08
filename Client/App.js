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

import {
  AppLoading,
  Login,
  Signup,
  Profile,
  ProfileUpdate,
} from './src/export_src';

const _appStack = createStackNavigator({
  profile: {
    screen: Profile,
    navigationOptions: {
      header: null,
    },
  },
  profileUpdate: {
    screen: ProfileUpdate,
    navigationOptions: {
      header: null,
    },
  },
});
const _authStatck = createStackNavigator(
  {
    login: {
      screen: Login,
    },
    signup: {
      screen: Signup,
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
      appLoading: AppLoading,
      app: _appStack,
      auth: _authStatck,
    },
    {
      initialRouteName: 'appLoading',
    },
  ),
);
const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={{flex: 1}}>
        <_AppContainer />
      </View>
    </>
  );
};

export default App;
