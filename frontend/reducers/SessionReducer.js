import ActionType from '../actions/ActionType'
import merge from 'lodash/merge';

const _nullUser = Object.freeze({
  currentUser: null,
  errors: []
});

const SessionReducer = (state = _nullUser, action) => {
  Object.freeze(state)
  switch(action.type) {
    case ActionType.App.Session.RECEIVE_CURRENT_USER:
      const currentUser = action.currentUser;
      return merge({}, _nullUser, {
        currentUser
      });
    case ActionType.App.Session.LOGOUT:
      return merge({}, _nullUser);
    case ActionType.App.Session.RECEIVE_ERRORS:
      const errors = action.errors;
      return merge({}, _nullUser, {
        errors
      });
    case ActionType.App.Uploads.SET_FOLDER_ID:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          settings: {
            ...state.currentUser.settings,
            drive_uploads_folder_id: action.folderId,
          }
        }
      }
    default:
      return state;
  }
};

export default SessionReducer;
