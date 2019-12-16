import {actionTypes} from '../export';

var user = {};
export const userReducer = (state = user, action) => {
  switch (action.type) {
    case actionTypes.USER_UPDATE:
      console.log('__________________ userReducer, state = ', state);
      console.log('__________________ userReducer, action.user = ', action.user);
      let newUser = {
        ...state,
        ...action.user
      };
      console.log('__________________ userReducer, newUser = ', newUser);
      return newUser;
    default:
      return state;
  }
};
