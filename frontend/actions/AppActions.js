import ActionType from '../actions/ActionType'

export const toggleDrawer = () => ({
  type: ActionType.App.View.TOGGLE_DRAWER,
})

export const fetchEverything = promiseArray => dispatch => {
  return dispatch => Promise.all(promiseArray)
}

// export const fetchItems = (newParams = {}, query = '', requestedResultCount = 10) => dispatch => ({
//   Promise.all([
//     dispatch(fetchPocketItems()),
//     dispatch(loadList())
//   ])/*.then(() => dispatch({type: ActionType.App.Functionality.ITEMS_LOADED}))*/
// })
