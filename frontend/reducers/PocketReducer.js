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
      // let list = action.items.list;
      let oldState = union([], state);
      // let newState = [];
      let newState = action.items;
      // Object.keys(list).forEach(key => {
      //   let d = new Date(0);
      //   d.setUTCSeconds(list[key].time_added);
      //   newState.push({
      //     service: 'pocket',
      //     date: d,
      //     item: list[key]
      //   })});

      let nextState = uniq(union(oldState, newState));
      // nextState.sort((a, b) => parseInt(b.time) - parseInt(a.time));
      // nextState.sort((a, b) => b.date - a.date)
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
      // return update(state, {$merge: {offset: nextOffset += 20}})
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
