import merge from 'lodash/merge'
import union from 'lodash/union'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import { combineReducers } from 'redux'
import ActionType from '../actions/ActionType'

let nextOffset = 0;

const allItemsReducer = (state = [], action) => {
  switch (action.type) {
    case ActionType.Pocket.Items.LOAD_SUCCESS:
      let oldStatePocket = union([], state);
      let newStatePocket = action.items;

      let nextStatePocket = uniq(union(oldStatePocket, newStatePocket))
      .sort((a, b) => b.date - a.date)

      return nextStatePocket;
    case ActionType.Gmail.Thread.LOAD_LIST_SUCCESS:
      let oldStateGmail = union([], state);
      let newStateGmail = uniqBy(action.messages, 'threadID');

      let nextStateGmail = union(oldStateGmail, newStateGmail)
      .sort((a, b) => b.date - a.date)

      return nextStateGmail;
    default:
      return state;
  }
}

const servicesItemsReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionType.Pocket.Items.LOAD_SUCCESS:
      return {
        ...state,
        pocket: true
      }
    case ActionType.Gmail.Thread.LOAD_LIST_SUCCESS:
      return {
        ...state,
        gmail: true
      }
    default:
      return state;
  }
}

// export default itemsReducer;

export default combineReducers({
  allItems: allItemsReducer,
  servicesLoaded: servicesItemsReducer
})
