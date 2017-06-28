import ActionType from '../ActionType'
import * as LabelAPI from '../../util/Gmail/LabelAPI'

export const loadAll = () => dispatch => {
  dispatch({type: ActionType.Gmail.Label.FETCH_ALL_REQUEST})

  LabelAPI.list().then(labels => {
    dispatch({
      type: ActionType.Gmail.Label.FETCH_ALL_SUCCESS,
      labels: labels,
    })
  }, error => {
    dispatch({
      type: ActionType.Gmail.Label.FETCH_ALL_FAILURE,
      error
    })
  })
}

export const create = labelName => dispatch => {
  dispatch({type: ActionType.Gmail.Label.CREATE_REQUEST, labelName})

  LabelAPI.create(labelName).then(labels => {
    dispatch({
      type: ActionType.Gmail.Label.CREATE_SUCCESS,
      label: labels
    })
  }, error => {
    dispatch({
      type: ActionType.Gmail.Label.CREATE_FAILURE,
      error
    })
  })
}
