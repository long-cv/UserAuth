import React from 'react';
import {Image, TouchableOpacity} from 'react-native';

const ImageButton: () => React$Node = props => {
  let {onPress, ...prop} = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <Image {...prop} />
    </TouchableOpacity>
  );
};

export {ImageButton};
