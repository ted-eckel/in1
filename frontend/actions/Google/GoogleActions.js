/** @flow */

import ActionType from '../ActionType'

export const gmailAuthRequest = () => dispatch => {
  dispatch({type: ActionType.Gmail.Authorization.REQUEST});
}

export const driveAuthRequest = () => dispatch => {
  dispatch({type: ActionType.Drive.Authorization.REQUEST});
}

export const gmailAuthSuccess = () => dispatch => {
  dispatch({type: ActionType.Gmail.Authorization.SUCCESS});
}

export const gmailAuthFailure = () => dispatch => {
  dispatch({type: ActionType.Gmail.Authorization.FAILURE});
}

export const driveAuthSuccess = () => dispatch => {
  dispatch({type: ActionType.Drive.Authorization.SUCCESS});
}

export const driveAuthFailure = () => dispatch => {
  dispatch({type: ActionType.Drive.Authorization.FAILURE});
}

// export const initClient = () => {
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
//         gmailAuthorization(true);
//       } else {
//         gmailAuthorization(false);
//       }
//
//       if (scopes.checkInclusion([
//         "https://www.googleapis.com/auth/drive",
//         "https://www.googleapis.com/auth/drive.appdata",
//         "https://www.googleapis.com/auth/drive.file",
//         "https://www.googleapis.com/auth/drive.metadata",
//         "https://www.googleapis.com/auth/drive.photos.readonly"
//       ])) {
//         driveAuthorization(true);
//       } else {
//         driveAuthorization(false);
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
//
// String.prototype.checkInclusion = function(strArray) {
//   for (let i = 0; i < strArray.length; i++){
//     if (this.includes(strArray[i]) === false) { return false }
//   }
//   return true;
// }
