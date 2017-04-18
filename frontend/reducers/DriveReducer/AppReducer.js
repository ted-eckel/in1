/** @flow */

import ActionType from '../../actions/ActionType'

module.exports = (appState = {searchQuery: "mimeType != 'application/vnd.google-apps.folder' and trashed = false"}, action) => {
  switch (action.type) {
    case ActionType.Drive.App.SEARCH:
      return {
        ...appState,
        searchQuery: action.searchQuery,
      };
  }
  return appState;
};
