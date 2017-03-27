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
  .then(items => {
    if (items.status !== 2) {
      return dispatch(receiveItems(items));
    } else {
      return dispatch({type: ActionType.Pocket.Items.END_OF_LIST})
    }
  });
}
