import ActionType from '../actions/ActionType'
import union from 'lodash/union'
import uniq from 'lodash/uniq'

const defaultState = {
  isAuthorized: false,
  isAuthorizing: false,
  labels: {},
  threadList: [],
  threadMessages: []
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
    case ActionType.Gmail.Thread.LOAD_LIST_SUCCESS:
      let threadList = action.threadList;
      let oldState = union([], state);
      let nextState = uniq(union(oldState, threadList));

      return {
        ...state,
        threadList: nextState
      }
    default:
      return state;
  }
};

export default GoogleReducer
