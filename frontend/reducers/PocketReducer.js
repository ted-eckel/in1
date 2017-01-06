import {
  RECEIVE_ITEMS
} from '../actions/session_actions';

const PocketReducer = (state = {
  items: {}
}, action) => {
  switch (action.type) {
    case RECEIVE_ITEMS:
      return {
        ...state,
        items: action.items
      }
    default:
      return state;
  }
};

export default PocketReducer
