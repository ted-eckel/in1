import ActionType from '../ActionType'
import * as LabelAPI from '../../util/Gmail/LabelAPI'

export function loadAll() {
  return dispatch => {
    dispatch({type: ActionType.Gmail.Label.FETCH_ALL_REQUEST});

    LabelAPI.list().then(labels => {
      dispatch({
        type: ActionType.Gmail.Label.FETCH_ALL_SUCCESS,
        labels: labels,
      });
    }).catch(() => {
      dispatch({
        type: ActionType.Gmail.Label.FETCH_ALL_FAILURE,
      });
    });
  };
};
