import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  SafeAreaView,
  AsyncStorage,
  FlatList,
} from 'react-native';
import {assets} from '../../data/export_data';
import {ListItem} from '../export_src';

class Profile extends Component {
  pressUpdate = () => {
    let {navigation} = this.props;
    let user = navigation.state.params;
    navigation.navigate('profileUpdate', user);
  };
  pressLoguotAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('login');
  };
  renderSeparator = () => {
    return <View style={{height: 1, backgroundColor: 'black'}} />;
  };
  //UNSAFE_componentWillMount() {}
  render() {
    let user = this.props.navigation.state.params;
    let dataArr = [
      {id: 'item1', title: 'Email', info: user?.userEmail},
      {id: 'item2', title: 'Phone', info: user?.userPhoneNumber},
    ];
    return (
      <SafeAreaView style={__style.profile_scr}>
        <View style={__style.avatarStyle}>
          <Image style={__style.avatarImageStyle} source={assets.avatar} />
          <Text style={__style.txtNameStyle}>{user?.userName}</Text>
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

export default Profile;
