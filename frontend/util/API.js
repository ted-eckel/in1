/** @flow */

import ActionType from '../actions/ActionType'

// export const login = () => {
//   return window.gapi.auth2.getAuthInstance().then(GoogleAuth => {
//     let isSignedIn = GoogleAuth.isSignedIn.get();
//     if (isSignedIn) {
//       this.gmailClientInit()
//     } else {
//       GoogleAuth.signIn().then(() => gmailClientInit());
//     }
//   })
// }
//
// const gmailClientInit = () => dispatch => {
//   dispatch({type: ActionType.Gmail.Authorization.REQUEST})
//   return window.gapi.client.init({
//     discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
//     clientId: '128518506637-qcrlhsu7pnivdarnagtshk9hdv600c4c.apps.googleusercontent.com',
//     scope: "https://www.googleapis.com/auth/gmail.modify"
//   }).then(res => {
//     dispatch({type: ActionType.Gmail.Authorization.SUCCESS})
//   }, err => {
//     dispatch({type: ActionType.Gmail.Authorization.FAILURE})
//   })
// }
// 
// const driveClientInit = () => dispatch => {
//   dispatch({type: ActionType.Drive.Authorization.REQUEST})
//   return window.gapi.client.init({
//     discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
//     clientId: '128518506637-qcrlhsu7pnivdarnagtshk9hdv600c4c.apps.googleusercontent.com',
//     scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.photos.readonly"
//   }).then(res => {
//     dispatch({type: ActionType.Drive.Authorization.SUCCESS})
//   }, err => {
//     dispatch({type: ActionType.Drive.Authorization.FAILURE})
//   })
// }
//
// export const driveLogin = () => {
//   return window.gapi.auth2.getAuthInstance().then(GoogleAuth => {
//     let isSignedIn = GoogleAuth.isSignedIn.get();
//     if (isSignedIn) {
//       this.driveClientInit()
//     } else {
//       GoogleAuth.signIn().then(() => driveClientInit());
//     }
//   })
// }
