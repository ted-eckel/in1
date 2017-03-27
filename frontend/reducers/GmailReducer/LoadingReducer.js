/** @flow */

import ActionType from '../../actions/ActionType'

module.exports = (state = false, action) => {
  switch (action.type) {
    case ActionType.Gmail.Authorization.REQUEST:
      return true;
    case ActionType.Gmail.Authorization.SUCCESS:
      return false;
    case ActionType.Gmail.Thread.LOAD_LIST_REQUEST:
      return true;
    case ActionType.Gmail.Thread.LOAD_LIST_SUCCESS:
      return false;
  }
  return state;
}
