import React, {Component} from 'react';
import {
  View,
  Button,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  AsyncStorage,
  Alert,
} from 'react-native';
import axios from 'axios';
import {URL_REQ, Service} from '../export_src';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      userPassword: '',
      userConfirmedPassword: '',
      userName: '',
      userPhoneNumber: '',
    };
  }
  setUserEmail = email => {
    this.setState({userEmail: email});
  };
  setUserPassword = password => {
    this.setState({userPassword: password});
  };
  setUserConfirmedPassword = password => {
    this.setState({userConfirmedPassword: password});
  };
  setUserName = name => {
    this.setState({userName: name});
  };
  setUserPhoneNumber = phoneNumber => {
    this.setState({userPhoneNumber: phoneNumber});
  };
  pressSubmitAsync = async () => {
    let {
      userName,
      userEmail,
      userPassword,
      userConfirmedPassword,
      userPhoneNumber,
    } = this.state;
    if (!(userName && userEmail && userPassword)) {
      Alert.alert('Note', 'Please enter your name, email and password!');
      return;
    }
    if (userPassword !== userConfirmedPassword) {
      Alert.alert('Note', 'Password not match!');
      return;
    }
    let serv = new Service();
    if (!serv.isEmail(userEmail)) {
      Alert.alert('Note', 'Not an email.');
      return;
    }
    if (!serv.isPhoneNumber(userPhoneNumber)) {
      Alert.alert('Note', 'Not a phone number.');
      return;
    }
    try {
      let user = {
        userEmail: userEmail,
        userPassword: userPassword,
        userName: userName,
        userPhoneNumber: userPhoneNumber,
      };
      let response = await axios({
        method: 'POST',
        url: URL_REQ.USER_REGISTER,
        data: user,
      });
      console.log(response.data);
      console.log(response.status);
      console.log(response.config);
      if (response.data.success) {
        await AsyncStorage.setItem('userToken', response.data.jwt);
        this.props.navigation.navigate('profile', user);
      } else {
        if (response.status === 201) {
          Alert.alert('Note', 'Sign up successfully! Please log in.');
          this.props.navigation.navigate('login');
        } else {
          Alert.alert('Warning', response.data.message);
        }
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        Alert.alert('Error', error.response.data.message);
        return;
      }
      if (error.config) {
        console.log(error.config);
      }
      Alert.alert('Error', 'Sign up failed! Please try again.');
    }
  };
  pressBack = () => {
    this.props.navigation.navigate('login');
  };
  render() {
    return (
      <SafeAreaView style={__style.container}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={__style.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={__style.signin_scr}>
            <TextInput
              style={__style.txtInput}
              placeholder="Enter email address"
              keyboardType="email-address"
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
            <TextInput
              style={__style.txtInput}
              placeholder="Confirm password"
              secureTextEntry
              autoCorrect={false}
              onChangeText={text => this.setUserConfirmedPassword(text)}
            />
            <TextInput
              style={__style.txtInput}
              placeholder="Enter your name"
              onChangeText={text => this.setUserName(text)}
            />
            <TextInput
              style={__style.txtInput}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              onChangeText={text => this.setUserPhoneNumber(text)}
            />
            <View style={__style.btnStyle}>
              <Button title="Submit" onPress={this.pressSubmitAsync} />
            </View>
            <View style={__style.btnStyle}>
              <Button title="Back" onPress={this.pressBack} />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }
}

const __style = StyleSheet.create({
  signin_scr: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
  },
  txtInput: {
    backgroundColor: '#1890ab',
    color: '#ebf3f5',
    height: 40,
    marginVertical: 4,
  },
  btnStyle: {
    marginVertical: 4,
  },
});

export default Signup;
