/** @flow */

import ActionType from '../../actions/ActionType'

const defaultState = {
  isAuthorized: false,
  isAuthorizing: false,
};

const AuthorizationReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.Drive.Authorization.REQUEST:
      return {
        ...state,
        isAuthorizing: true,
      };
    case ActionType.Drive.Authorization.SUCCESS:
      return {
        ...state,
        isAuthorized: true,
        isAuthorizing: false,
      };
    case ActionType.Drive.Authorization.FAILURE:
      return {
        ...state,
        isAuthorized: false,
        isAuthorizing: false,
      };
    case ActionType.Gmail.Thread.LOAD_LIST_SUCCESS:
    case ActionType.Drive.File.LOAD_LIST_SUCCESS:
      return {
        ...state,
        isAuthorized: true,
        isAuthorizing: false,
      };
  }
  return state;
};

export default AuthorizationReducer
