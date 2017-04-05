import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from './store'
import Root from './components/Root'
import merge from 'lodash/merge'

document.addEventListener('DOMContentLoaded', () => {
  let store;
  let preloadedState = {};
  if (window.currentUser) {
    // const preloadedState = { session: { currentUser: window.currentUser } };
    merge(preloadedState, { session: { currentUser: window.currentUser } })
  }
  if (window.pocketAuthorized === true) {
    merge(preloadedState, { pocket: { authorization: { isAuthorized: true } } })
  }
  if (window.pocketAuthorized === false) {
    merge(preloadedState, { pocket: { authorization: { isAuthorized: false } } })
  }
  store = configureStore(preloadedState);
  // } else {
  //   store = configureStore();
  // }
  let root = document.getElementById('root');
  if (root){
    ReactDOM.render(<Root store={ store }/>, root);
  }
});
