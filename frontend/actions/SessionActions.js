import ActionType from '../actions/ActionType'
import * as APIUtil from '../util/SessionAPI'

export const signup = user => dispatch => (
  APIUtil.signup(user)
    .then(user => dispatch(receiveCurrentUser(user)),
      err => dispatch(receiveErrors(err.responseJSON)))
);

export const login = user => dispatch => (
  APIUtil.login(user)
    .then(user => dispatch(receiveCurrentUser(user)),
      err => dispatch(receiveErrors(err.responseJSON)))
);

export const logout = () => dispatch => (
  APIUtil.logout().then(user => dispatch(receiveCurrentUser(null)))
);

export const receiveCurrentUser = currentUser => ({
  type: ActionType.App.Session.RECEIVE_CURRENT_USER,
  currentUser
});

export const receiveErrors = errors => ({
  type: ActionType.App.Session.RECEIVE_ERRORS,
  errors
});
