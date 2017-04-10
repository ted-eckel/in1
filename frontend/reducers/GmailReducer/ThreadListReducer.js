import ActionType from '../../actions/ActionType'

module.exports = (threadListByQuery = {}, action) => {
  const threadList = action.query ? threadListByQuery[action.query] : threadListByQuery['labelIds:INBOX'];
  switch (action.type) {
    case ActionType.Gmail.Thread.FETCH_LIST_REQUEST:
      if (threadList) {
        if (threadList === threadListByQuery['labelIds:INBOX']) {
          return {
            ...threadListByQuery,
            'labelIds:INBOX': {
              ...threadList,
              isFetching: true,
            },
          }
        } else {
          return {
            ...threadListByQuery,
            [action.query]: {
              ...threadList,
              isFetching: true,
            },
          }
        }
      } else {
        if (!action.query) {
          return {
            ...threadListByQuery,
            'labelIds:INBOX': {
              threadIDs: [],
              nextPageToken: null,
              resultSizeEstimate: null,
              isFetching: true,
            }
          }
        } else {
          return {
            ...threadListByQuery,
            [action.query]: {
              threadIDs: [],
              nextPageToken: null,
              resultSizeEstimate: null,
              isFetching: true,
            }
          }
        }
      }

    case ActionType.Gmail.Thread.FETCH_LIST_SUCCESS:
      const newThreadIDs = action.threads.map(thread => thread.id);
      if (action.query) {
        return {
          ...threadListByQuery,
          [action.query]: {
            threadIDs: [...threadList.threadIDs, ...newThreadIDs],
            nextPageToken: action.nextPageToken,
            resultSizeEstimate: action.resultSizeEstimate,
            isFetching: false
          }
        }
      } else {
        return {
          ...threadListByQuery,
          'labelIds:INBOX': {
            threadIDs: [...threadList.threadIDs, ...newThreadIDs],
            nextPageToken: action.nextPageToken,
            resultSizeEstimate: action.resultSizeEstimate,
            isFetching: false
          }
        }
      }

    case ActionType.Gmail.Thread.REFRESH:
      console.log('clearing the store')
      return {};

    case ActionType.Gmail.Thread.ARCHIVE_REQUEST:
      return removeThread(threadListByQuery, action.threadID, /labelIds\:\s*INBOX/);

    case ActionType.Gmail.Thread.MOVE_TO_INBOX_REQUEST:
      return removeMatchingQueries(threadListByQuery, /labelIds\:\s*INBOX/);

    case ActionType.Gmail.Thread.UNSTAR_REQUEST:
      return removeThread(
        threadListByQuery,
        action.threadID,
        /is\:\s*starred/
      );

    case ActionType.Gmail.Thread.TRASH_REQUEST:
      return removeThread(threadListByQuery, action.threadID, /labelIds\:\s*INBOX/);
  }
  return threadListByQuery;
};

function removeThread(threadListByQuery, threadIDToRemove, queryRegex) {
  return Object.keys(threadListByQuery)
    .reduce((newThreadListByQuery, query) => {
      if (queryRegex.test(query)) {
        const existingThreadList = threadListByQuery[query];
        const newThreadIDs = existingThreadList.threadIDs.filter(
          threadID => threadID !== threadIDToRemove
        );
        if (newThreadIDs.length < existingThreadList.threadIDs.length) {
          newThreadListByQuery[query] = {
            ...existingThreadList,
            threadIDs: newThreadIDs,
          };
        } else {
          newThreadListByQuery[query] = existingThreadList;
        }
      }

      return newThreadListByQuery;
    }, {});
}

function removeMatchingQueries(threadListByQuery, queryRegex) {
  return Object.keys(threadListByQuery)
    .reduce((newThreadListByQuery, query) => {
      if (!queryRegex.test(query)) {
        newThreadListByQuery[query] = threadListByQuery[query];
      }

      return newThreadListByQuery;
    }, {});
}
