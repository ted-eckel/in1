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
      let oldThreadListState = union([], state.threadList);
      let newThreadListState = [];

      threadList.forEach(thread => newThreadListState.push(thread));
      let nextThreadListState = uniq(union(oldThreadListState, newThreadListState));

      return {
        ...state,
        threadList: nextThreadListState
      }
    case ActionType.Gmail.Thread.LOAD_SUCCESS:
      let threadMessages = action.threadMessages;
      let oldThreadMessagesState = union([], state.threadMessages);
      let newThreadMessagesState = [];

      threadMessages.forEach(threadMessage => newThreadMessagesState.push(threadMessage))
      let nextThreadMessagesState = union(oldThreadMessagesState, newThreadMessagesState);

      return {
        ...state,
        threadMessages: nextThreadMessagesState
      }
    default:
      return state;
  }
};

export default GoogleReducer
