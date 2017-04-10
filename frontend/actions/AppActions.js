import ActionType from '../actions/ActionType'
import * as PocketAPI from '../util/PocketAPI'
import * as GnailAPI from '../util/Gmail/ThreadAPI'

export const toggleDrawer = () => ({
  type: ActionType.App.View.TOGGLE_DRAWER,
})

export const fetchEverything = promiseArray => dispatch => Promise.all(promiseArray);


export const dispatchAllItems = items => ({
  type: ActionType.App.Items.FETCH_SUCCESS,
  items
})
// export const fetchItems = (newParams = {}, query = '', requestedResultCount = 10) => dispatch => ({
//   Promise.all([
//     dispatch(fetchPocketItems()),
//     dispatch(loadList())
//   ])/*.then(() => dispatch({type: ActionType.App.Functionality.ITEMS_LOADED}))*/
// })
