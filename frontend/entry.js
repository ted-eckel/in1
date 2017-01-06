import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from './store'
import Root from './components/Root'

import { signup, login, logout } from './util/session_api_util';
import { pocketRetrieve } from './util/pocket_api_util';

window.signup = signup;
window.login = login;
window.logout = logout;
window.pocketRetrieve = pocketRetrieve;
window.store = configureStore();

document.addEventListener('DOMContentLoaded', () => {
  let store;
  if (window.currentUser) {
    const preloadedState = { session: { currentUser: window.currentUser } };
    store = configureStore(preloadedState);
  } else {
    store = configureStore();
  }
  ReactDOM.render(
    <Root store={ store }/>,
    document.getElementById('root')
  );
});
