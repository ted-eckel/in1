import merge from 'lodash/merge'
import union from 'lodash/union'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import { combineReducers } from 'redux'
import ActionType from '../actions/ActionType'

// const servicesItemsReducer = (state = {}, action) => {
//   switch (action.type) {
//     case ActionType.Pocket.Items.LOAD_SUCCESS:
//       return {
//         ...state,
//         pocket: true
//       }
//     case ActionType.Gmail.Authorization.SUCCESS:
//       return {
//         ...state,
//         gmail: true
//       }
//     case ActionType.Gmail.Authorization.FAILURE:
//       return {
//         ...state,
//         gmail: false
//       }
//     case ActionType.Drive.Authorization.SUCCESS:
//       return {
//         ...state,
//         drive: true
//       }
//     case ActionType.Drive.Authorization.FAILURE:
//       return {
//         ...state,
//         drive: false
//       }
//     default:
//       return state;
//   }
// }

const servicesItemsReducer = (state = [], action) => {
  switch (action.type) {
    case ActionType.Pocket.Items.LOAD_SUCCESS:
      let oldPocketState = union([], state);
      let newPocketState = ['pocket'];
      let nextPocketState = union(oldPocketState, newPocketState);
      return nextPocketState;
    case ActionType.Gmail.Authorization.SUCCESS:
      let oldGmailSuccessState = union([], state);
      let newGmailSuccessState = ['gmail'];
      let nextGmailSuccessState = union(oldGmailSuccessState, newGmailSuccessState);
      return nextGmailSuccessState;
    case ActionType.Gmail.Thread.LOAD_LIST_SUCCESS:
      // let oldGmailSuccessState = union([], state);
      // let newGmailSuccessState = ['gmail'];
      // let nextGmailSuccessState = uniq(union(oldGmailSuccessState, newGmailSuccessState));
      // return nextGmailSuccessState;
    case ActionType.Gmail.Authorization.FAILURE:
      let oldGmailFailureState = union([], state);
      let newGmailFailureState = ['gmail'];
      let nextGmailFailureState = union(oldGmailFailureState, newGmailFailureState);
      return nextGmailFailureState;
    case ActionType.Drive.Authorization.SUCCESS:
      let oldDriveSuccessState = union([], state);
      let newDriveSuccessState = ['drive'];
      let nextDriveSuccessState = union(oldDriveSuccessState, newDriveSuccessState);
      return nextDriveSuccessState;
    case ActionType.Drive.Authorization.FAILURE:
      let oldDriveFailureState = union([], state);
      let newDriveFailureState = ['drive'];
      let nextDriveFailureState = union(oldDriveFailureState, newDriveFailureState);
      return nextDriveFailureState;
    default:
      return state;
  }
}

// export default itemsReducer;

export default combineReducers({
  // allItems: allItemsReducer,
  servicesLoaded: servicesItemsReducer
})
