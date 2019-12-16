import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  AsyncStorage,
  FlatList,
  Alert,
} from 'react-native';
import {ListItem} from '../export_src';
import {ImageButton} from '../export_src';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {URL_REQ} from '../export_src';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateUser} from '../../redux/export';

const mapStateToProps = state => {
  return {
    user: state.user
  }
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators({updateUser}, dispatch);
};

class Profile extends Component {
  pressUpdate = () => {
    let {navigation} = this.props;
    navigation.navigate('profileUpdate');
  };
  pressLoguotAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('login');
  };
  renderSeparator = () => {
    return <View style={{height: 1, backgroundColor: 'black'}} />;
  };
  onPressImageButton = () => {
    let options = {
      title: 'Select Avatar',
      //customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
      storageOptions: {
        skipBackup: true,
        //path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, async response => {
      //console.log('response: ', response);
      if (response.didCancel) {
        console.log('cancel image picker.');
      } else if (response.customButtom) {
        console.log('custom button: ', response.customButton);
      } else if (response.error) {
        console.log('error: ', response.error);
      } else {
        let {user} = this.props;
        let avatar = new FormData();
        avatar.append('userEmail', user?.userEmail);
        avatar.append('avatar', {
          uri: response.uri,
          name: response.fileName,
          type: response.type,
        });
        try {
          let token = await AsyncStorage.getItem('userToken');
          let resp = await axios({
            method: 'POST',
            url: URL_REQ.USER_AVATAR,
            headers: {
              authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
            },
            data: avatar,
          });
          //console.log(resp.data);
          if (resp.data.success) {
            let newUser = {userAvatar: resp.data.user.userAvatar};
            this.props.updateUser(newUser);
          }
        } catch (error) {
          //console.log(error.response.config);
          Alert.alert('Error', 'Updating avatar failed.');
        }
      }
    });
  };
  //UNSAFE_componentWillMount() {}
  render() {
    let {user} = this.props;
    if (!user) return;
    let dataArr = [
      {id: 'item1', title: 'Email', info: user.userEmail},
      {id: 'item2', title: 'Phone', info: user.userPhoneNumber},
    ];
    return (
      <SafeAreaView style={__style.profile_scr}>
        <View style={__style.avatarStyle}>
          <ImageButton
            onPress={this.onPressImageButton}
            style={__style.avatarImageStyle}
            source={{uri: user.userAvatar}}
          />
          <Text style={__style.txtNameStyle}>{user.userName}</Text>
        </View>
        <View style={__style.detailStyle}>
          <FlatList
            data={dataArr}
            renderItem={({item}) => (
              <ListItem title={item.title} info={item.info} />
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
          />
          <View style={{marginVertical: 6}}>
            <Button title="Update" onPress={this.pressUpdate} />
          </View>
          <View style={{marginVertical: 6}}>
            <Button title="Log out" onPress={this.pressLoguotAsync} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const __style = StyleSheet.create({
  profile_scr: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 20,
  },
  avatarStyle: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailStyle: {
    flex: 8,
  },
  avatarImageStyle: {
    width: 70,
    height: 70,
    resizeMode: 'stretch',
  },
  txtNameStyle: {
    marginLeft: 20,
    fontSize: 30,
    fontWeight: 'bold',
  },
});

const ProfileContainer = connect(mapStateToProps, mapDispatchToProps)(Profile);
export default ProfileContainer;
