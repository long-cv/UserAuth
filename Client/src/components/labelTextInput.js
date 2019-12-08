import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const LabelTextInput: () => React$Node = props => {
  let {label, ...prop} = props;
  return (
    <View style={styles.container}>
      <Text style={styles.left}>{label}</Text>
      <TextInput style={styles.right} {...prop} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    //height: 40,
  },
  left: {
    flex: 1,
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
  right: {
    flex: 2,
  },
});

export {LabelTextInput};
