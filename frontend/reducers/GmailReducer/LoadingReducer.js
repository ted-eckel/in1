/** @flow */

import ActionType from '../../actions/ActionType'

module.exports = (state = false, action) => {
  switch (action.type) {
    case ActionType.Gmail.Request.START:
      return true;
    case ActionType.Gmail.Request.ALL_STOPPED:
      return false;
  }
  return state;
};
