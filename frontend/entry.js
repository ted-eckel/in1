import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from './store'
import Root from './components/Root'

import { signup, login, logout } from './util/session_api_util'
import { pocketRetrieve } from './util/pocket_api_util'

import * as SessionActions from './actions/session_actions'
import * as PocketActions from './actions/PocketActions'
import * as GoogleActions from './actions/GoogleActions'
import ActionType from './actions/ActionType'
import * as APIUtil from './util/pocket_api_util'

window.signup = signup;
window.login = login;
window.logout = logout;
window.pocketRetrieve = pocketRetrieve;
window.store = configureStore();

window.SessionActions = SessionActions;
window.PocketActions = PocketActions;
window.GoogleActions = GoogleActions;
window.ActionType = ActionType;
window.APIUtil = APIUtil;

document.addEventListener('DOMContentLoaded', () => {
  let store;
  if (window.currentUser) {
    const preloadedState = { session: { currentUser: window.currentUser } };
    store = configureStore(preloadedState);
  } else {
    store = configureStore();
  }
  let root = document.getElementById('root');
  if (root){
    ReactDOM.render(<Root store={ store }/>, root);
  }
});
