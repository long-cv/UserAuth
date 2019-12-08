import React, {Component} from 'react';
import {
  TextInput,
  Text,
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  AsyncStorage,
  Alert,
} from 'react-native';
import axios from 'axios';
import {URL_REQ} from '../export_src';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      userPassword: '',
    };
  }
  setUserEmail(email) {
    this.setState({
      userEmail: email,
    });
  }
  setUserPassword(password) {
    this.setState({
      userPassword: password,
    });
  }
  pressLoginAsync = async () => {
    if (!(this.state.userEmail && this.state.userPassword)) {
      Alert.alert(
        'Note',
        'Please enter email or password!',
        [{text: 'OK', onPress: () => console.log('press Alert OK')}],
        {cancelable: false},
      );
      return;
    }
    try {
      let response = await axios.post(URL_REQ.USER_LOGIN, {
        userEmail: this.state.userEmail,
        userPassword: this.state.userPassword,
      });
      console.log(response.data);
      console.log(response.status);
      console.log(response.config);
      if (response.data.success) {
        await AsyncStorage.setItem('userToken', response.data.jwt);
        this.props.navigation.navigate('profile', response.data.user);
      } else {
        Alert.alert('Warning', response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        Alert.alert('Warning', error.response.data.message);
        return;
      } else {
        console.log('Error', error.message);
      }
      if (error.response) {
        console.log(error.config);
      }
      Alert.alert('Error', 'Error! Please try again.');
    }
  };
  pressSignup = () => {
    this.props.navigation.navigate('signup');
  };
  render() {
    return (
      <SafeAreaView style={__style.container}>
        <TouchableWithoutFeedback
          style={__style.login_scr}
          onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={__style.login_scr}>
            <TextInput
              style={__style.txtInput}
              placeholder="Enter email address"
              keyboarType="email-address"
              autoCorrect={false}
              onChangeText={text => this.setUserEmail(text)}
            />
            <TextInput
              style={__style.txtInput}
              placeholder="Enter password"
              secureTextEntry
              autoCorrect={false}
              onChangeText={text => this.setUserPassword(text)}
            />
            <Button title="Log in" onPress={this.pressLoginAsync} />
            <Text style={{textAlign: 'center'}}>OR</Text>
            <Button title="Sign up" onPress={this.pressSignup} />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }
}

const __style = StyleSheet.create({
  container: {
    flex: 1,
  },
  login_scr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginHorizontal: 10,
  },
  txtInput: {
    backgroundColor: '#1890ab',
    height: 40,
    marginVertical: 4,
  },
});

export default Login;
