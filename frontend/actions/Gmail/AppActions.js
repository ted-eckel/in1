const ActionType = require('../ActionType');

export function search(searchQuery) {
  return {
    type: ActionType.Gmail.App.SEARCH,
    searchQuery
  };
};
