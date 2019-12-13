import React from 'react';
import {
  SafeAreaView,
  Button,
  View,
  StyleSheet,
  AsyncStorage,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from 'react-native';
import axios from 'axios';
import {URL_REQ, LabelTextInput, Service} from '../export_src';

class ProfileUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
    };
  }
  setUserState = (userState, value) => {
    this.setState({[userState]: value});
  };
 
  onPressSubmit = async () => {
    let {navigation} = this.props;
    let user = navigation.state.params;
    if (!user) return;

    let {name, email, password, phoneNumber} = this.state;
    if (!(name || email || password || phoneNumber)) {
      Alert.alert('Note', 'Nothing is entered.');
      return;
    }
    let serv = new Service();
    if (email && !serv.isEmail(email)) {
      Alert.alert('Note', 'Not an email.');
      return;
    }
    if (phoneNumber && !serv.isPhoneNumber(phoneNumber)) {
      Alert.alert('Note', 'Not a phone number.');
      return;
    }
    try {
      let token = await AsyncStorage.getItem('userToken');
      let newUser = new Object();
      if (name) newUser.userName = name;
      if (email) newUser.userEmail = email;
      if (password) newUser.userPassword = password;
      if (phoneNumber) newUser.userPhoneNumber = phoneNumber;
      console.log(newUser);
      let response = await axios({
        method: 'PUT',
        url: URL_REQ.USER_UPDATE,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          email: user.userEmail,
          newUser: newUser,
        },
      });
      console.log(response.data);
      console.log(response.config);
      if (response.data.success) {
        if (response.data.jwt) await AsyncStorage.setItem('userToken', response.data.jwt);
        navigation.navigate('profile', newUser);
      } else {
        if (response.status === 201) {
          Alert.alert('Note', 'Update successfully! Please log in.');
          await AsyncStorage.clear();
          navigation.navigate('login');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred! Please try again.');
      console.log(error);
    }
  };
  onPressCancel = () => {
    this.props.navigation.navigate('profile');
  };
  render = () => {
    let user = this.props.navigation.state.params;
    return (
      <SafeAreaView style={styles.entireScr}>
        <TouchableWithoutFeedback
          style={styles.entireScr}
          onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView style={styles.entireScr}>
            <View style={styles.area01}>
              <LabelTextInput
                label="Name"
                placeholder={user?.userName}
                onChangeText={text => this.setUserState('name', text)}
              />
              <LabelTextInput
                label="Email"
                placeholder={user?.userEmail}
                keyboardType="email-address"
                autoCorrect={false}
                onChangeText={text => this.setUserState('email', text)}
              />
              <LabelTextInput
                label="Password"
                placeholder="enter new password"
                secureTextEntry
                autoCorrect={false}
                onChangeText={text => this.setUserState('password', text)}
              />
              <LabelTextInput
                label="Phone"
                placeholder={user?.userPhoneNumber}
                keyboardType="phone-pad"
                onChangeText={text => this.setUserState('phoneNumber', text)}
              />
            </View>
            <View style={styles.area02}>
              <View style={{marginBottom: 12}}>
                <Button title="Submit" onPress={this.onPressSubmit} />
              </View>
              <Button title="Cancel" onPress={this.onPressCancel} />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  entireScr: {
    flex: 1,
    marginHorizontal: 10,
  },
  area01: {
    flex: 5,
    justifyContent: 'center',
  },
  area02: {
    flex: 2,
  },
});

export {ProfileUpdate};
