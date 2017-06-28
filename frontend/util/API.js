/** @flow */

import ActionType from '../actions/ActionType'

export const changeSettings = settings => {
  return $.ajax({
    method: 'PATCH',
    url: 'api/change_settings',
    data: settings
  })
}

export const initClient = () => dispatch => {
  window.gapi.auth2.init(
    {
      client_id: '128518506637-qcrlhsu7pnivdarnagtshk9hdv600c4c.apps.googleusercontent.com'
    }
  ).then(GoogleAuth => {
    let isSignedIn = GoogleAuth.isSignedIn.get();

    if (isSignedIn) {
      let currentUser = GoogleAuth.currentUser.get();
      dispatch({type: ActionType.App.Session.RECEIVE_GOOGLE_USER, googleUser: currentUser.getBasicProfile().getEmail()})
      let scopes = currentUser.getGrantedScopes();

      if (scopes.includes("https://www.googleapis.com/auth/gmail.modify")){
        dispatch({type: ActionType.Gmail.Authorization.REQUEST});
        window.gapi.client.load(
          "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
        )
        .then(res => dispatch({type: ActionType.Gmail.Authorization.SUCCESS}),
        err => dispatch({type: ActionType.Gmail.Authorization.FAILURE}))
      } else {
        dispatch({type: ActionType.Gmail.Authorization.FAILURE});
      }

      if (checkInclusion(scopes, [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.appdata",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.metadata",
        "https://www.googleapis.com/auth/drive.photos.readonly"
      ])) {
        dispatch({type: ActionType.Drive.Authorization.REQUEST});
        window.gapi.client.load(
          "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
        )
        .then(res => dispatch({type: ActionType.Drive.Authorization.SUCCESS}),
        err => dispatch({type: ActionType.Drive.Authorization.FAILURE}))
      } else {
        dispatch({type: ActionType.Drive.Authorization.FAILURE})
      }
    } else {
      dispatch({type: ActionType.Drive.Authorization.FAILURE});
      dispatch({type: ActionType.Gmail.Authorization.FAILURE});
    }
  });
}

const checkInclusion = (str, arr) => {
  for (let i = 0; i < arr.length; i++){
    if (str.includes(arr[i]) === false) { return false }
  }
  return true;
}
