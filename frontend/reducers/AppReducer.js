import ActionType from '../actions/ActionType'

const AppReducer = (state = {
    drawerOpen: false
}, action) => {
  switch (action.type) {
    case ActionType.App.View.TOGGLE_DRAWER:
      let oldState = state.drawerOpen;
      return {
        ...state,
        drawerOpen: !oldState
      }
    default:
      return state;
  }
}

export default AppReducer
