/** @flow */

import ActionType from '../../actions/ActionType'

module.exports = (state = false, action) => {
  switch (action.type) {
    case ActionType.Drive.File.FETCH_LIST_REQUEST:
      return true;
    case ActionType.Drive.File.FETCH_LIST_SUCCESS:
      return false;
  }
  return state;
};
