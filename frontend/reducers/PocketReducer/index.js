import merge from 'lodash/merge'
import union from 'lodash/union'
import uniq from 'lodash/uniq'
import { combineReducers } from 'redux'
import update from 'react/lib/update'
import ActionType from '../../actions/ActionType'

import ItemListReducer from './ItemListReducer'
import AppReducer from './AppReducer'

const itemsByIDReducer = (itemsByID = {}, action) => {
  switch (action.type) {
    case ActionType.Pocket.Items.FETCH_SUCCESS:
      return action.items.reduce(
        (newItemsByID, item) => {
          newItemsByID[item.id] = item
          return newItemsByID
        },
        {...itemsByID},
      );
      // let oldState = union([], state);
      // let newState = action.items;
      // let nextState = uniq(union(oldState, newState));
      // return nextState;
    default:
      return itemsByID;
  }
}

// const paramsReducer = (state = {
//     count: 20,
//     detailType: "complete",
//     offset: 0,
//     search: ''
// }, action) => {
//   switch (action.type) {
//     case ActionType.Pocket.Items.FETCH_REQUEST:
//       return update(state, {$merge: action.params})
//     case ActionType.Pocket.Items.FETCH_SUCCESS:
//       let nextState = merge({}, state);
//       nextState.offset += 20;
//       return nextState;
//     default:
//       return state;
//   }
// }

const isFetchingReducer = (state = false, action) => {
  switch (action.type) {
    case ActionType.Pocket.Items.FETCH_REQUEST:
      return true
    case ActionType.Pocket.Items.FETCH_SUCCESS:
      return false
    case ActionType.Pocket.Items.FETCH_FAILURE:
      return false
    default:
      return state;
  }
}

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case ActionType.Pocket.Items.FETCH_FAILURE:
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

const authorizationReducer = (state = {
  isAuthorized: null,
  isAuthorizing: false
}, action) => {
  switch (action.type) {
    case ActionType.Pocket.Authorization.REQUEST:
      return {
        ...state,
        isAuthorizing: true,
      }
    case ActionType.Pocket.Authorization.SUCCESS:
      return {
        ...state,
        isAuthorized: true,
        isAuthorizing: false,
      }
    case ActionType.Pocket.Authorization.FAILURE:
      return {
        ...state,
        isAuthorized: false,
        isAuthorizing: false,
      }
    default:
      return state
  }
}

export default combineReducers({
  app: AppReducer,
  itemsByID: itemsByIDReducer,
  itemListBySearch: ItemListReducer,
  // params: paramsReducer,
  isFetching: isFetchingReducer,
  error: errorReducer,
  endOfList: endOfListReducer,
  authorization: authorizationReducer,
})
