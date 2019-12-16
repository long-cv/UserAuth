import {actionTypes} from '../export';

const updateUser = user => {
  return {
    type: actionTypes.USER_UPDATE,
    user
  };
};

export default updateUser;
