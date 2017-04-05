/** @flow */

import ActionType from '../../actions/ActionType'

module.exports = (state = [], action) => {
  switch (action.type) {
    case ActionType.Gmail.Label.FETCH_ALL_SUCCESS:
      return action.labels;
  }
  return state;
};
