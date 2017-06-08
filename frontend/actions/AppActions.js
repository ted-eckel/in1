import ActionType from '../actions/ActionType'
import * as ApiUtil from '../util/API'

export const toggleDrawer = () => ({
  type: ActionType.App.View.TOGGLE_DRAWER,
})

export const toggleKeepModal = () => ({
  type: ActionType.App.View.TOGGLE_KEEP_MODAL,
})

export const fetchEverything = promiseArray => dispatch => Promise.all(promiseArray);


export const dispatchAllItems = items => ({
  type: ActionType.App.Items.FETCH_SUCCESS,
  items
})

export const search = string => ({
  type: ActionType.App.Functionality.SEARCH,
  string
})

export const setUploadFolderId = folderId => dispatch => {
  dispatch({type: ActionType.App.Uploads.SET_FOLDER_ID, folderId})
  ApiUtil.changeSettings({drive_uploads_folder_id: folderId})
}

export const toggleCreateNoteModal = note => ({
  type: ActionType.App.View.TOGGLE_CREATE_NOTE_MODAL,
  note
})

// export const fetchItems = (newParams = {}, query = '', requestedResultCount = 10) => dispatch => ({
//   Promise.all([
//     dispatch(fetchPocketItems()),
//     dispatch(loadList())
//   ])/*.then(() => dispatch({type: ActionType.App.Functionality.ITEMS_LOADED}))*/
// })
