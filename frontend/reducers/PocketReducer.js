import merge from 'lodash/merge'
import union from 'lodash/union'
import uniq from 'lodash/uniq'
import { combineReducers } from 'redux'
import update from 'react/lib/update'
import ActionType from '../actions/ActionType'

let nextOffset = 0;

const itemsReducer = (state = [], action) => {
  switch (action.type) {
    case ActionType.Pocket.Items.LOAD_SUCCESS:
      let oldState = union([], state);
      let newState = action.items;
      let nextState = uniq(union(oldState, newState));
      return nextState;
    default:
      return state;
  }
}

const paramsReducer = (state = {
    count: 20,
    detailType: "complete",
    offset: 0
}, action) => {
  switch (action.type) {
    case ActionType.Pocket.Items.LOAD_REQUEST:
      return update(state, {$merge: action.params})
    case ActionType.Pocket.Items.LOAD_SUCCESS:
      let nextState = merge({}, state);
      nextState.offset += 20;
      return nextState;
    default:
      return state;
  }
}

const isFetchingReducer = (state = false, action) => {
  switch (action.type) {
    case ActionType.Pocket.Items.LOAD_REQUEST:
      return true
    case ActionType.Pocket.Items.LOAD_SUCCESS:
      return false
    case ActionType.Pocket.Items.LOAD_FAILURE:
      return false
    default:
      return state;
  }
}

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case ActionType.Pocket.Items.LOAD_FAILURE:
      return action.error
    default:
      return state;
  }
}

const endOfListReducer = (state = false, action) => {
  switch (action.type) {
    case ActionType.Pocket.Items.END_OF_LIST:
      return true
    default:
      return state;
  }
}

export default combineReducers({
  items: itemsReducer,
  params: paramsReducer,
  isFetching: isFetchingReducer,
  error: errorReducer,
  endOfList: endOfListReducer
})
