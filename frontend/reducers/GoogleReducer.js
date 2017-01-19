import ActionType from '../actions/ActionType'

const defaultState = {
  isAuthorized: false,
  isAuthorizing: false,
};

const GoogleReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.Gmail.Authorization.REQUEST:
      return {
        ...state,
        isAuthorizing: true,
      };
    case ActionType.Gmail.Authorization.SUCCESS:
      return {
        ...state,
        isAuthorized: true,
        isAuthorizing: false,
      };
    case ActionType.Gmail.Authorization.FAILURE:
      return {
        ...state,
        isAuthorized: false,
        isAuthorizing: false,
      };
  }
  return state;
};

export default GoogleReducer
