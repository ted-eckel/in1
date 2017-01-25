import ActionType from '../actions/ActionType'

const AppReducer = (state = {
    drawerOpen: false,
    gridList: true
}, action) => {
  switch (action.type) {
    case ActionType.App.View.TOGGLE_DRAWER:
      let oldDrawerState = state.drawerOpen;
      return {
        ...state,
        drawerOpen: !oldDrawerState
      }
    case ActionType.App.View.TOGGLE_LIST_TYPE:
      let oldListState = state.gridList;
      return {
        ...state,
        gridList: !oldListState
      }
    default:
      return state;
  }
}

export default AppReducer
