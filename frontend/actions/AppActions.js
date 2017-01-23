import ActionType from '../actions/ActionType'
import {fetchItems as fetchPocketItems} from './PocketActions'
import {loadList as loadGmailItems} from './Gmail/ThreadActions'

export const toggleDrawer = () => ({
  type: ActionType.App.View.TOGGLE_DRAWER,
})

// export const fetchItems = (newParams = {}, query = '', requestedResultCount = 10) => dispatch => ({
//   Promise.all([
//     dispatch(fetchPocketItems()),
//     dispatch(loadList())
//   ])/*.then(() => dispatch({type: ActionType.App.Functionality.ITEMS_LOADED}))*/
// })
