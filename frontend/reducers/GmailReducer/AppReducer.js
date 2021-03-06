/** @flow */

import ActionType from '../../actions/ActionType'

module.exports = (appState = {searchQuery: ''}, action) => {
  switch (action.type) {
    case ActionType.Gmail.App.SEARCH:
      return {
        ...appState,
        searchQuery: action.searchQuery,
      };
  }
  return appState;
};
