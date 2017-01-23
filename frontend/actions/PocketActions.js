import ActionType from '../actions/ActionType'
import * as APIUtil from '../util/pocket_api_util'

export const requestItems = params => ({
  type: ActionType.Pocket.Items.LOAD_REQUEST,
  params
})

export const receiveItems = items => (
  {
    type: ActionType.Pocket.Items.LOAD_SUCCESS,
    items: Object.keys(items.list).map(key => {
      let d = new Date(0);
      d.setUTCSeconds(items.list[key].time_added);
      return {
        service: 'pocket',
        date: d,
        item: items.list[key]
      }})
  }
)

export const receiveError = error => ({
  type: ActionType.Pocket.Items.LOAD_FAILURE,
  error
})

export const fetchItems = (newParams = {}) => (dispatch, getState) => {
  dispatch(requestItems(newParams));
  let params = getState().pocket.params;
  return APIUtil.pocketRetrieve(params)
  .then(items => dispatch(receiveItems(items)));
}

// const shouldFetchItems = state => {
//   const pocket = state.pocket
//   if (pocket.items.length === 0) {
//     return true
//   }
//   if (pocket.isFetching) {
//     return false
//   }
//   return false
// }

// export const fetchItemsIfNeeded = state => (dispatch, getState) => {
//   if (shouldFetchItems(getState())) {
//     return dispatch(fetchItems(getState()))
//   }
// }

// const fetchSuccess = items => dispatch => dispatch(receiveItems(items));
// const fetchError = error => dispatch => dispatch(receiveError(error));
//
// export const fetchItems = params => dispatch => {
//   dispatch(requestItems(params));
//   return APIUtil.pocketRetrieve(params, fetchSuccess, fetchError);
// }
