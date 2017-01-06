import { RECEIVE_CURRENT_USER, LOGOUT, RECEIVE_ERRORS } from '../actions/session_actions';

const SessionReducer = (state = {
  currentUser: null,
  errors: []
}, action) => {
  switch(action.type) {
    case RECEIVE_CURRENT_USER:
      return {
        ...state,
        currentUser: action.currentUser
      }
    case LOGOUT:
      return {
        ...state,
        currentUser: null
      }
    case RECEIVE_ERRORS:
      return {
        ...state,
        errors: action.errors
      }
    default:
      return state;
  }
};

export default SessionReducer;
