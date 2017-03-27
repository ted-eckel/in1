/** @flow */

import ActionType from '../../actions/ActionType'

module.exports = (state = false, action) => {
  switch (action.type) {
    // case ActionType.Drive.Authorization.REQUEST:
    //   return true;
    // case ActionType.Drive.Authorization.SUCCESS:
    //   return false;
    case ActionType.Drive.File.LOAD_LIST_REQUEST:
      return true;
    case ActionType.Drive.File.LOAD_LIST_SUCCESS:
      return false;
  }
  return state;
};
