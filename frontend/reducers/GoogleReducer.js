import ActionType from '../actions/ActionType'

const defaultState = {
  isAuthorized: false,
  isAuthorizing: false,
  labels: {}
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
    case ActionType.Gmail.Label.LOAD_ALL_SUCCESS:
      return {
        ...state,
        labels: action.labels
      };
    default:
      return state;
  }
};

export default GoogleReducer
