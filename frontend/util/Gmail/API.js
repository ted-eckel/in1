/** @flow */

import ActionType from '../../actions/ActionType'
import getClientID from './ClientID'
import RSVP from 'rsvp'
import configureStore from '../../store'

let isAvailable = false;
let pendingRequests = [];

let store = configureStore();

RSVP.on('error', function(error) {
  console.error(error, error.stack);
});

window.handleGoogleClientLoad = function() {
  tryAuthorize(/*immediate*/ true);
};

const tryAuthorize = immediate => {
  store.dispatch({type: ActionType.Gmail.Authorization.REQUEST});
  window.gapi.auth.authorize(
    {
      client_id: '128518506637-qcrlhsu7pnivdarnagtshk9hdv600c4c.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/gmail.modify',
      immediate
    },
    whenAuthenticated
  );
}

const whenAuthenticated = authResult => {
  if (authResult && !authResult.error) {
    store.dispatch({type: ActionType.Gmail.Authorization.SUCCESS});
    window.gapi.client.load('gmail', 'v1', whenLoaded);
  } else {
    store.dispatch({type: ActionType.Gmail.Authorization.FAILURE});
  }
}

function whenLoaded() {
  isAvailable = true;
  if (pendingRequests.length) {
    pendingRequests.forEach(request => request());
  }
  pendingRequests = [];
}

function promiseGoogleApiAvailable() {
  if (isAvailable) {
    return RSVP.Promise.resolve();
  }

  return new RSVP.Promise((resolve) => {
    pendingRequests.push(resolve);
  });
}

const inProgressAPICalls = {};

/**
 * Wraps a function with API in-progress reporting and error logging.
 */
function wrap(
  getPromise: () => Promise
): Promise {
  const id = getClientID();
  inProgressAPICalls[id] = true;
  store.dispatch({type: ActionType.Gmail.Request.START});

  const promise = promiseGoogleApiAvailable().then(() => {
    return getPromise();
  });

  promise.catch(error => console.log('API Error', error));

  return promise.finally(() => {
    delete inProgressAPICalls[id];
    if (!Object.keys(inProgressAPICalls).length) {
      store.dispatch({type: ActionType.Gmail.Request.ALL_STOPPED});
    }
  });
}

function isInProgress(): boolean {
  return !!Object.keys(inProgressAPICalls).length;
}

/**
 * Executes a Google API request (anything with an execute method), turning
 * it into a promise. The promise is rejected if the response contains an
 * error field, resolved otherwise.
 */
function execute(request: GoogleAPIExecutable) {
  return new RSVP.Promise((resolve, reject) => {
    request.execute(response => {
      if (response.error) {
        console.error('API Error', response.error);
        reject(response.error);
        return;
      }

      resolve(response);
    });
  });
}


export default {
  execute,
  isInProgress,
  login: tryAuthorize.bind(null, false),
  wrap
}
// module.exports = {
//   login: tryAuthorize.bind(null, /*immediate*/ false),
// };
