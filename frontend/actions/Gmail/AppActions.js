import ActionType from '../ActionType'

export function search(searchQuery) {
  return {
    type: ActionType.Gmail.App.SEARCH,
    searchQuery
  };
};


export const gmailLogin = () => dispatch => {
  dispatch({type: ActionType.Gmail.Authorization.REQUEST})
  window.gapi.auth2.getAuthInstance().signIn(
    {
      scope: 'https://www.googleapis.com/auth/gmail.modify profile email'
    }
  ).then(res => {
    dispatch({type: ActionType.Gmail.Authorization.SUCCESS, res})
  }, err => {
    dispatch({type: ActionType.Gmail.Authorization.FAILURE, err})
  })
}
