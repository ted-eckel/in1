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
      let list = action.items.list;
      let oldState = union([], state);
      let newState = [];

      Object.keys(list).forEach(key => newState.push({
        service: "pocket",
        time: parseInt(list[key].time_added),
        item: list[key]
      }));

      let nextState = uniq(union(oldState, newState));
      nextState.sort((a, b) => b.time - a.time);
      return nextState;
    case ActionType.Gmail.ThreadMessages.LOAD_SUCCESS:
      let messages = action.items.messages;
      let oldState = union([], state);
      let newState = [];

      messages.forEach(message => newState.push({
        service: "Gmail",
        time: ""
      }))
    default:
      return state;
  }
}

// gapi.client.gmail.users.threads.list({
//   userId: 'me',
//   labelIds: 'INBOX',
//   maxResults: 10
// }).execute(
//   response => Object.keys(response.threads).forEach(
//     (thread, idx) => {
//       thread_array.push({
//         service: "Gmail",
//         thread: response.threads[thread],
//         messages: []
//       });
//     }
//   )
// )
//
// thread_array.forEach(
//   threadKey => {
//     gapi.client.gmail.users.threads.get({
//       userId: 'me',
//       id: threadKey.thread.id
//     }).execute(
//       response => response.messages.forEach(message => threadKey.messages.push(message))
//     )
//   }
// )
