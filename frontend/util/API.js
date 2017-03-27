/** @flow */

import ActionType from '../actions/ActionType'
import getClientID from './Gmail/ClientID'
import RSVP from 'rsvp'
import configureStore from '../store'

let gmailIsAvailable;
let driveIsAvailable;

let isAvailable = false;

let pendingRequests = [];
// let drivePendingRequests = [];
// let gmailPendingRequests = [];

let store = configureStore();

RSVP.on('error', function(error) {
  console.error(error, error.stack);
});

window.handleGoogleClientLoad = function() {
  tryAuthorize(/*immediate*/ true);
};

const tryAuthorize = immediate => {
  gmailTryAuthorize(immediate);
  driveTryAuthorize(immediate);
}

const gmailTryAuthorize = immediate => {
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

const driveTryAuthorize = immediate => {
  store.dispatch({type: ActionType.Drive.Authorization.REQUEST});
  window.gapi.auth.authorize(
    {
      client_id: '128518506637-qcrlhsu7pnivdarnagtshk9hdv600c4c.apps.googleusercontent.com',
      scope: ["https://www.googleapis.com/auth/drive",
              "https://www.googleapis.com/auth/drive.appdata",
              "https://www.googleapis.com/auth/drive.file",
              "https://www.googleapis.com/auth/drive.metadata",
              "https://www.googleapis.com/auth/drive.photos.readonly"],
      immediate
    },
    driveWhenAuthenticated
  );
}

const driveWhenAuthenticated = authResult => {
  if (authResult && !authResult.error) {
    store.dispatch({type: ActionType.Drive.Authorization.SUCCESS});
    window.gapi.client.load('drive', 'v3', driveWhenLoaded);
    // if (isAvailable) {
    // } else {
    //   window.gapi.client.load('drive', 'v3', firstWhenLoaded);
    //   driveIsAvailable = true;
    // }
  } else {
    store.dispatch({type: ActionType.Drive.Authorization.FAILURE});
    driveIsAvailable = false;
  }
}

const whenAuthenticated = authResult => {
  if (authResult && !authResult.error) {
    store.dispatch({type: ActionType.Gmail.Authorization.SUCCESS});
    window.gapi.client.load('gmail', 'v1', whenLoaded);
    // if (isAvailable) {
    //   window.gapi.client.load('gmail', 'v1', gmailWhenLoaded);
    // } else {
    //   gmailIsAvailable = true;
    // }
  } else {
    store.dispatch({type: ActionType.Gmail.Authorization.FAILURE});
    gmailIsAvailable = false;
  }
}

// function firstWhenLoaded() {
//   isAvailable = true;
//   if (pendingRequests.length) {
//     pendingRequests.forEach(request => request());
//   }
//   pendingRequests = [];
// }

// function gmailWhenLoaded() {
//   gmailIsAvailable = true;
// }

function driveWhenLoaded() {
  driveIsAvailable = true;
}

function whenLoaded() {
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
  store.dispatch({type: ActionType.App.Request.START});

  const promise = promiseGoogleApiAvailable().then(() => {
    return getPromise();
  });

  promise.catch(error => console.log('API Error', error));

  return promise.finally(() => {
    delete inProgressAPICalls[id];
    if (!Object.keys(inProgressAPICalls).length) {
      store.dispatch({type: ActionType.App.Request.ALL_STOPPED});
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

// function executeTwo() {
//   return new RSVP.Promise((resolve, reject) => (response => {
//     if (response.error) {
//       console.error('API Error', response.error);
//       reject(response.error);
//       return;
//     }
//
//     resolve(response);
//   }));
// }


export default {
  execute,
  // executeTwo,
  isInProgress,
  login: gmailTryAuthorize.bind(null, false),
  driveLogin: driveTryAuthorize.bind(null, false),
  wrap
}
// module.exports = {
//   login: tryAuthorize.bind(null, /*immediate*/ false),
// };
