import ActionType from '../ActionType'

export function search(searchQuery) {
  return {
    type: ActionType.Drive.App.SEARCH,
    searchQuery
  };
};

export const driveLogin = () => dispatch => {
  dispatch({type: ActionType.Drive.Authorization.REQUEST})
  window.gapi.auth2.getAuthInstance().signIn(
    {
      scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.photos.readonly profile email'
    }
  )
  .then(res => {
    dispatch({type: ActionType.Drive.Authorization.SUCCESS, res})
  }, err => {
    dispatch({type: ActionType.Drive.Authorization.FAILURE, err})
  })
}
