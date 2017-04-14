/** @flow */

import ActionType from '../actions/ActionType'
//

// import { initClient } from '../actions/Google/GoogleActions'
//
// window.handleGoogleClientLoad = function() {
//   gapi.load('client:auth2', initClient);
// };

// function initClient() {
//   gapi.auth2.init(
//     {
//       client_id: '128518506637-qcrlhsu7pnivdarnagtshk9hdv600c4c.apps.googleusercontent.com'
//     }
//   ).then(GoogleAuth => {
//     let isSignedIn = GoogleAuth.isSignedIn.get();
//     if (isSignedIn) {
//       console.log("isSignedIn = true");
//       let currentUser = GoogleAuth.currentUser.get();
//       let scopes = currentUser.getGrantedScopes();
//
//       if (scopes.includes("https://www.googleapis.com/auth/gmail.modify")){
//         dispatch({type: ActionType.Gmail.Authorization.SUCCESS});
//       } else {
//         dispatch({type: ActionType.Gmail.Authorization.FAILURE});
//       }
//
//       if (scopes.checkInclusion([
//         "https://www.googleapis.com/auth/drive",
//         "https://www.googleapis.com/auth/drive.appdata",
//         "https://www.googleapis.com/auth/drive.file",
//         "https://www.googleapis.com/auth/drive.metadata",
//         "https://www.googleapis.com/auth/drive.photos.readonly"
//       ])) {
//         dispatch({type: ActionType.Drive.Authorization.SUCCESS});
//       } else {
//         dispatch({type: ActionType.Drive.Authorization.FAILURE});
//       }
//       // console.log(`scopes includes gmail? => ${scopes.includes("https://www.googleapis.com/auth/gmail.modify")}`);
//       // console.log(`scopes includes drive? => ${scopes.checkInclusion([
//       //   "https://www.googleapis.com/auth/drive",
//       //   "https://www.googleapis.com/auth/drive.appdata",
//       //   "https://www.googleapis.com/auth/drive.file",
//       //   "https://www.googleapis.com/auth/drive.metadata",
//       //   "https://www.googleapis.com/auth/drive.photos.readonly"
//       // ])}`)
//     } else {
//       console.log("isSignedIn = false");
//     }
//   });
// }

String.prototype.checkInclusion = function(strArray) {
  for (let i = 0; i < strArray.length; i++){
    if (this.includes(strArray[i]) === false) { return false }
  }
  return true;
}

export const login = () => dispatch => {
  return window.gapi.auth2.getAuthInstance().then(GoogleAuth => {
    let isSignedIn = GoogleAuth.isSignedIn.get();
    if (isSignedIn) {
      gmailClientInit()
    } else {
      GoogleAuth.signIn().then(() => gmailClientInit());
    }
  })
}

const gmailClientInit = () => dispatch => {
  dispatch({type: ActionType.Gmail.Authorization.REQUEST})
  window.gapi.client.init({
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
    clientId: '128518506637-qcrlhsu7pnivdarnagtshk9hdv600c4c.apps.googleusercontent.com',
    scope: "https://www.googleapis.com/auth/gmail.modify"
  }).then(res => {
    dispatch({type: ActionType.Gmail.Authorization.SUCCESS})
  }, err => {
    dispatch({type: ActionType.Gmail.Authorization.FAILURE})
  })
}

const driveClientInit = () => dispatch => {
  dispatch({type: ActionType.Drive.Authorization.REQUEST})
  window.gapi.client.init({
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    clientId: '128518506637-qcrlhsu7pnivdarnagtshk9hdv600c4c.apps.googleusercontent.com',
    scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.photos.readonly"
  }).then(res => {
    dispatch({type: ActionType.Drive.Authorization.SUCCESS})
  }, err => {
    dispatch({type: ActionType.Drive.Authorization.FAILURE})
  })
}

export const driveLogin = () => dispatch => {
  return window.gapi.auth2.getAuthInstance().then(GoogleAuth => {
    let isSignedIn = GoogleAuth.isSignedIn.get();
    if (isSignedIn) {
      driveClientInit()
    } else {
      GoogleAuth.signIn().then(() => driveClientInit());
    }
  })
}

// const driveWhenAuthenticated = authResult => {
//   if (authResult && !authResult.error) {
//     store.dispatch({type: ActionType.Drive.Authorization.SUCCESS});
//     window.gapi.client.load('drive', 'v3', driveWhenLoaded);
//   } else {
//     store.dispatch({type: ActionType.Drive.Authorization.FAILURE});
//   }
// }
//
// const whenAuthenticated = authResult => {
//   if (authResult && !authResult.error) {
//     store.dispatch({type: ActionType.Gmail.Authorization.SUCCESS});
//     window.gapi.client.load('gmail', 'v1', whenLoaded);
//   } else {
//     store.dispatch({type: ActionType.Gmail.Authorization.FAILURE});
//   }
// }


// export default {
//   login: gmailTryAuthorize.bind(null, false),
//   driveLogin: driveTryAuthorize.bind(null, false),
// }
// module.exports = {
//   login: tryAuthorize.bind(null, /*immediate*/ false),
// };
