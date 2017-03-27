const ActionType = require('../ActionType');

export function search(searchQuery) {
  return {
    type: ActionType.Drive.App.SEARCH,
    searchQuery
  };
};
