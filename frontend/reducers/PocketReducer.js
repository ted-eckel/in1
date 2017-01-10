import merge from 'lodash/merge'
import { combineReducers } from 'redux'
import update from 'react/lib/update'
import ActionType from '../actions/ActionType'

let nextOffset = 0;

const itemsReducer = (state = [], action) => {
  switch (action.type) {
    case ActionType.Pocket.Items.LOAD_SUCCESS:
      // let deepCopyState = merge({}, state);
      // let deepCopyItems = merge({}, action.items.list);
      let list = action.items.list;
      let newState = [];
      // return {
      //   ...deepCopyState,
      //   ...deepCopyItems
      // }
      Object.keys(list).forEach(key => newState.push(list[key]))
      newState.sort((a, b) => parseInt(b.time_added) - parseInt(a.time_added))
      return update(state, {$push: newState})
      // let list = action.items.list;
      // return {
      //   ...state,
      //   ...list
      // }
      // return update(state, action.items.list)
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
      return update(state, {$merge: {offset: nextOffset += 20}})
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

export default combineReducers({
  items: itemsReducer,
  params: paramsReducer,
  isFetching: isFetchingReducer,
  error: errorReducer
})
