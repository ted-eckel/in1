/** @flow */

import ActionType from '../../actions/ActionType'

export default (state = {
  isAuthorized: null,
  isAuthorizing: false,
}, action) => {
  switch (action.type) {
    case ActionType.Gmail.Authorization.REQUEST:
      return {
        ...state,
        isAuthorizing: true,
      }
    case ActionType.Gmail.Authorization.SUCCESS:
      return {
        ...state,
        isAuthorized: true,
        isAuthorizing: false,
      }
    case ActionType.Gmail.Authorization.FAILURE:
      return {
        ...state,
        isAuthorized: false,
        isAuthorizing: false,
      }
    case ActionType.Gmail.Thread.FETCH_LIST_SUCCESS:
      return {
        ...state,
        isAuthorized: true,
        isAuthorizing: false,
      }
  }
  return state
}
