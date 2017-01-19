import ActionType from '../actions/ActionType'
import * as APIUtil from '../util/google_api_util'
import config from '../config'

export function checkAuth(immediate, callback) {
  window.gapi.client.setApiKey(config.apiKey);
  window.gapi.auth.authorize({
    'client_id': config.clientId,
    'scope': config.scope,
    'immediate': immediate
  }, callback);
}

export function load() {
  window.gapi.client.load('gmail', 'v1', () => {
    let request = window.gapi.client.gmail.users.labels.list({'userId': 'me'});
    request.execute(response => {
      for (let i = 0; i < response.labels.length; i++){
        let label = response.labels[i];
        console.log(label.name);
      };
    });
    // window.gapi.client.gmail.users.labels.list({
    //   'userId': 'me'
    // }).execute.then((response) => {
    //   const labels = response.labels;
    //   console.log('Labels:');
    //
    //   if (labels && labels.length > 0) {
    //     for (i = 0; i < labels.length; i++) {
    //       var label = labels[i];
    //       console.log(label.name)
    //     }
    //   } else {
    //     console.log('No Labels found.');
    //   }
    // })
  })
}

// import RSVP from 'rsvp';
// import store from '../store';
//
// let isAvailable = false;
// let pendingRequests = [];
//
// RSVP.on('error', function(error) {
//   console.error(error, error.stack);
// });
//
// window.handleGoogleClientLoad = () => {
//   tryAuthorize(/*immediate*/ true);
// };
//
// const tryAuthorize = immediate => dispatch => {
//   dispatch(requestAuthorization());
//   gapi.auth.authorize(
//     {
//       /*eslint-disable camelcase*/
//       client_id: config.clientId,
//       /*eslint-enable*/
//       scope: 'email https://www.googleapis.com/auth/gmail.modify',
//       immediate
//     },
//     whenAuthenticated
//   );
// }
//
// function whenAuthenticated(authResult) {
//   if (authResult && !authResult.error) {
//     store.dispatch({type: ActionType.Gmail.Authorization.SUCCESS});
//     gapi.client.load('gmail', 'v1', whenLoaded);
//   } else {
//     store.dispatch({type: ActionType.Gmail.Authorization.FAILURE});
//   }
// }
//
// function whenLoaded() {
//   isAvailable = true;
//   if (pendingRequests.length) {
//     pendingRequests.forEach(request => request());
//   }
//   pendingRequests = [];
// }
//
// function promiseGoogleApiAvailable() {
//   if (isAvailable) {
//     return RSVP.Promise.resolve();
//   }
//
//   return new RSVP.Promise((resolve) => {
//     pendingRequests.push(resolve);
//   });
// }
//
// const inProgressAPICalls = {};
//
// /**
//  * Wraps a function with API in-progress reporting and error logging.
//  */
// function wrap(
//   getPromise: () => Promise
// ): Promise {
//   const id = config.clientId;
//   inProgressAPICalls[id] = true;
//   store.dispatch({type: ActionType.Gmail.Request.START});
//
//   const promise = promiseGoogleApiAvailable().then(() => {
//     return getPromise();
//   });
//
//   promise.catch(error => console.log('API Error', error));
//
//   return promise.finally(() => {
//     delete inProgressAPICalls[id];
//     if (!Object.keys(inProgressAPICalls).length) {
//       store.dispatch({type: ActionType.Gmail.Request.ALL_STOPPED});
//     }
//   });
// }
//
// function isInProgress(): boolean {
//   return !!Object.keys(inProgressAPICalls).length;
// }
//
// /**
//  * Executes a Google API request (anything with an execute method), turning
//  * it into a promise. The promise is rejected if the response contains an
//  * error field, resolved otherwise.
//  */
// function execute(request: GoogleAPIExecutable) {
//   return new RSVP.Promise((resolve, reject) => {
//     request.execute(response => {
//       if (response.error) {
//         console.error('API Error', response.error);
//         reject(response.error);
//         return;
//       }
//
//       resolve(response);
//     });
//   });
// }

export const requestAuthorization = () => ({
  type: ActionType.Gmail.Authorization.REQUEST
})
//
// export const authorizationSuccess = () => ({
//   type: ActionType.Gmail.Authorization.SUCCESS
// })
//
// export const authorizationFailure = () => ({
//   type: ActionType.Gmail.Authorization.FAILURE
// })

// export const tryAuthorize = () => dispatch => {
//   dispatch(requestAuthorization());
//   console.log("after dispatch(requestAuthorization());")
//   window.gapi.load('client', () => {
//     console.log("inside window.gapi.load")
//     checkAuth();
//   });
// }

// window.checkAuth = () => dispatch => {
//   console.log("inside checkAuth()");
//   dispatch(requestAuthorization());
//   gapi.auth.authorize({
//     'client_id': config.clientId,
//     'scope': config.scope,
//     'immediate': true
//   }, handleAuthResult);
// }
//
// export const handleAuthResult = authResult => dispatch => {
//   console.log("inside handleAuthResult")
//   if (authResult && !authResult.error) {
//     dispatch(authorizationSuccess());
//     APIUtil.loadGmailApi();
//   } else {
//     dispatch(authorizationFailure());
//   }
// }
//
// export function handleAuthClicking(event) {
//   gapi.auth.authorize(
//     {client_id: config.clientId, scope: config.scope, immediate: false},
//     handleAuth);
//   return false;
// }
//
// export const handleAuth = authResult => (dispatch) => {
//   if (authResult && !authResult.error) {
//     dispatch(authorizationSuccess());
//     APIUtil.loadGmailApi();
//   } else {
//     dispatch(authorizationFailure());
//   }
// }

// export const requestItems = params => ({
//   type: ActionType.Pocket.Items.LOAD_REQUEST,
//   params
// })
//
// export const receiveItems = items => ({
//   type: ActionType.Pocket.Items.LOAD_SUCCESS,
//   items
// })
//
// export const receiveError = error => ({
//   type: ActionType.Pocket.Items.LOAD_FAILURE,
//   error
// })
//
// export const fetchItems = (newParams = {}) => (dispatch, getState) => {
//   dispatch(requestItems(newParams));
//   let params = getState().pocket.params;
//   return APIUtil.pocketRetrieve(params)
//   .then(items => dispatch(receiveItems(items)));
// }
