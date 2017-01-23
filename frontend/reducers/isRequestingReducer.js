import ActionType from '../actions/ActionType'

const isRequestingReducer = (state = false, action) => {
  switch (action.type) {
    case ActionType.App.Functionality.IS_REQUESTING:
      return true
    case ActionType.App.Functionality.IS_NOT_REQUESTING:
      return false
    default:
      return state;
  }
}

export default isRequestingReducer
