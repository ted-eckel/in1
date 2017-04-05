import ActionType from '../actions/ActionType'

export default (state = {
  drive: null,
  gmail: null,
  pocket: null
}, action) => {
  switch (action.type) {
    case ActionType.Gmail.Thread.FETCH_LIST_REQUEST:
      return {
        ...state,
        gmail: 'loading'
      }
    case ActionType.Gmail.Thread.FETCH_LIST_SUCCESS:
      return {
        ...state,
        gmail: 'success'
      }
    case ActionType.Gmail.Thread.FETCH_LIST_FAILURE:
      return {
        ...state,
        gmail: 'failure'
      }
    case ActionType.Pocket.Items.FETCH_REQUEST:
      return {
        ...state,
        pocket: 'loading'
      }
    case ActionType.Pocket.Items.FETCH_SUCCESS:
      return {
        ...state,
        pocket: 'success'
      }
    case ActionType.Pocket.Items.FETCH_FAILURE:
      return {
        ...state,
        pocket: 'failure'
      }
    default:
      return state
  }
}
