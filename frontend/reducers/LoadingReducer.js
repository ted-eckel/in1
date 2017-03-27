/** @flow */

import ActionType from '../actions/ActionType'

module.exports = (state = false, action) => {
  switch (action.type) {
    case ActionType.App.Request.START:
      return true;
    case ActionType.App.Request.ALL_STOPPED:
      return false;
  }
  return state;
};
