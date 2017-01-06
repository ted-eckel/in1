import React from 'react';
import ReactDOM from 'react-dom';

import { signup, login, logout } from './util/session_api_util';
import { pocketRetrieve } from './util/pocket_api_util';

window.signup = signup;
window.login = login;
window.logout = logout;
window.pocketRetrieve = pocketRetrieve;

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
      <div>Hello from React!</div>,
      document.getElementById('root')
    );
});
