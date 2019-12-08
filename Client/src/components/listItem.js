import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ListItem: () => React$Node = props => {
  const {title, info} = props;
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.infoText}>{info}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 15,
    height: 40,
    textAlignVertical: 'center',
  },
  infoText: {
    flex: 2,
    fontSize: 15,
    height: 40,
    textAlignVertical: 'center',
  },
});

export {ListItem};
