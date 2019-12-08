import React, {Component} from 'react';
import {View, ActivityIndicator, AsyncStorage, StyleSheet} from 'react-native';
import axios from 'axios';
import {URL_REQ} from '../export_src';

class AppLoading extends Component {
  constructor(props) {
    super(props);
  }
  bootstrapAsync = async () => {
    try {
      let userToken = await AsyncStorage.getItem('userToken');
      console.log(userToken);
      if (userToken) {
        axios.get(URL_REQ.USER_INFO, {
          headers: {
            authorization: `Bearer ${userToken}`,
          }
        })
        .then(response => {
          this.props.navigation.navigate('profile', response.data.user);
          console.log(response.data);
          console.log(response.status);
          console.log(response.statusText);
          console.log(response.config);
        })
        .catch(error => {
          this.props.navigation.navigate('auth');
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else {
            console.log('Error', error.message);
          }
          console.log(error.config);
        });
      } else {
        this.props.navigation.navigate('auth');
      }
    } catch ({error}) {
      this.props.navigation.navigate('auth');
    }
  };
  render() {
    return (
      <View style={_styles.apploading_scr}>
        <ActivityIndicator size={120} color="#e81067" />
      </View>
    );
  }
  componentDidMount() {
    console.log('__________ called componentDidMuont');
    this.bootstrapAsync();
  }
  UNSAFE_componentWillMount() {}
}

const _styles = StyleSheet.create({
  apploading_scr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppLoading;
