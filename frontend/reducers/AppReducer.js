import ActionType from '../actions/ActionType'

const AppReducer = (state = {
    drawerOpen: false,
    gridList: true,
    keepModalOpen: false,
    createNoteModalOpen: false,
    search: '',
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
    case ActionType.App.View.TOGGLE_KEEP_MODAL:
      let oldModalState = state.keepModalOpen;
      return {
        ...state,
        keepModalOpen: !oldModalState
      }
    case ActionType.App.View.TOGGLE_CREATE_NOTE_MODAL:
      let oldNoteModalState = state.createNoteModalOpen;
      return {
        ...state,
        createNoteModalOpen: !oldNoteModalState
      }
    case ActionType.App.Functionality.SEARCH:
      return {
        search: action.string
      }
    default:
      return state;
  }
}

export default AppReducer
