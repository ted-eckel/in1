/** @flow */

import ActionType from '../../actions/ActionType'

export default (state = {
  isAuthorized: null,
  isAuthorizing: false,
}, action) => {
  switch (action.type) {
    case ActionType.Drive.Authorization.REQUEST:
      return {
        ...state,
        isAuthorizing: true,
      }
    case ActionType.Drive.Authorization.SUCCESS:
      return {
        ...state,
        isAuthorized: true,
        isAuthorizing: false,
      }
    case ActionType.Drive.Authorization.FAILURE:
      return {
        ...state,
        isAuthorized: false,
        isAuthorizing: false,
      }
    default:
      return state
  }
}
