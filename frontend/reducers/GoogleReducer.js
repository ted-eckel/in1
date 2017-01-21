import ActionType from '../actions/ActionType'

const defaultState = {
  isAuthorized: false,
  isAuthorizing: false,
  labels: {},
  threads: []
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
    case ActionType.Gmail.ThreadList.LOAD_LIST_SUCCESS:
      return {
        ...state,
        threads: action.threads
      }
    default:
      return state;
  }
};

export default GoogleReducer
