/** @flow */

import ActionType from '../ActionType';
import * as ThreadAPI from '../../util/Gmail/ThreadAPI';

export function load(threadID) {
  return (dispatch, getState) => {
    const {threadsByID} = getState().gmail;
    if (threadsByID.hasOwnProperty(threadID)) {
      // Already loading
      return;
    }

    dispatch({
      type: ActionType.Gmail.Thread.FETCH_REQUEST,
      threadID,
    });

    ThreadAPI.getByID({id: threadID}).then(({thread, messages}) => {
      dispatch({
        type: ActionType.Gmail.Thread.FETCH_SUCCESS,
        threadID,
        thread,
        messages,
      });
    }).catch(error => {
      dispatch({
        type: ActionType.Gmail.Thread.FETCH_FAILURE,
        threadID,
        error,
      });
    });
  };
}

export const loadList = (query = '', requestedResultCount = 20) => (dispatch, getState) => {
  const {threadListByQuery} = getState().gmail;
  const threadList = threadListByQuery[query];

  let pageToken = null;
  if (threadList) {
    pageToken = threadList.nextPageToken;
    if (!pageToken) {
      return;
    }
  }

  dispatch({
    type: ActionType.Gmail.Thread.FETCH_LIST_REQUEST,
    query,
    requestedResultCount,
  });

  ThreadAPI.list({
    query,
    pageToken,
    maxResults: requestedResultCount,
  // }).then(listResult => {
  // window.gapi.client.gmail.users.threads.list({
  //   userId: 'me',
  //   maxResults: requestedResultCount,
  //   labelIds: 'INBOX',
  //   q: query || null,
  //   pageToken: pageToken || null,
  // }).then(listResponse => {
  //   const threadIDs = (listResponse.result.threads || []).map(m => m.id);
  //
  //   if (!threadIDs.length) {
  //     return {
  //       nextPageToken: null,
  //       resultSizeEstimate: 0,
  //       threads: [],
  //       messages: [],
  //     };
  //   }
  //
  //   const batch = window.gapi.client.newBatch();
  //
  //   const threadRequest = id => {
  //     return window.gapi.client.gmail.users.threads.get({userId: 'me', id})
  //   }
  //
  //   threadIDs.forEach(id => {
  //     batch.add(threadRequest(id), {'id': id})
  //   })
  //
  //   return batch.then(batchResponse => {
  //     const results = threadIDs.map(threadID => batchResponse.result[threadID].result);
  //     const {threads, messages} = ThreadAPI.processThreadResults(results);
  //
  //     return {
  //       nextPageToken: listResponse.result.nextPageToken,
  //       resultSizeEstimate: listResponse.result.resultSizeEstimate,
  //       threads,
  //       messages,
  //     }
  //   })
  }).then(listResult => {
    dispatch({
      type: ActionType.Gmail.Thread.FETCH_LIST_SUCCESS,
      query,
      requestedResultCount,
      threads: listResult.threads,
      messages: listResult.messages,
      nextPageToken: listResult.nextPageToken,
      resultSizeEstimate: listResult.resultSizeEstimate,
    });
  }, error => {
    dispatch({
      type: ActionType.Gmail.Thread.FETCH_LIST_FAILURE,
      query,
      requestedResultCount,
    })
  })
}

export function refresh() {
  return {type: ActionType.Gmail.Thread.REFRESH};
}

export function markAsRead(threadID: string) {
  return dispatch => {
    dispatch({
      type: ActionType.Gmail.Thread.MARK_AS_READ_REQUEST,
      threadID,
    });

    ThreadAPI.markAsRead({threadID}).then(() =>
      dispatch({
        type: ActionType.Gmail.Thread.MARK_AS_READ_SUCCESS,
        threadID,
      })
    ).catch(error =>
      dispatch({
        type: ActionType.Gmail.Thread.MARK_AS_READ_FAILURE,
        threadID,
        error,
      })
    );
  };
}

export function markAsUnread(threadID: string) {
  return dispatch => {
    dispatch({
      type: ActionType.Gmail.Thread.MARK_AS_UNREAD_REQUEST,
      threadID,
    });

    ThreadAPI.markAsUnread({threadID}).then(() =>
      dispatch({
        type: ActionType.Gmail.Thread.MARK_AS_UNREAD_SUCCESS,
        threadID,
      })
    ).catch(error =>
      dispatch({
        type: ActionType.Gmail.Thread.MARK_AS_UNREAD_FAILURE,
        threadID,
        error,
      })
    );
  };
}

export function archive(threadID: string) {
  return dispatch => {
    dispatch({
      type: ActionType.Gmail.Thread.ARCHIVE_REQUEST,
      threadID,
    });

    ThreadAPI.archive({threadID}).then(() =>
      dispatch({
        type: ActionType.Gmail.Thread.ARCHIVE_SUCCESS,
        threadID,
      })
    ).catch(error =>
      dispatch({
        type: ActionType.Gmail.Thread.ARCHIVE_FAILURE,
        threadID,
        error,
      })
    );
  };
}

export function moveToInbox(threadID: string) {
  return dispatch => {
    dispatch({
      type: ActionType.Gmail.Thread.MOVE_TO_INBOX_REQUEST,
      threadID,
    });

    ThreadAPI.moveToInbox({threadID}).then(() =>
      dispatch({
        type: ActionType.Gmail.Thread.MOVE_TO_INBOX_SUCCESS,
        threadID,
      })
    ).catch(error =>
      dispatch({
        type: ActionType.Gmail.Thread.MOVE_TO_INBOX_FAILURE,
        threadID,
        error,
      })
    );
  };
}

export function star(threadID: string) {
  return dispatch => {
    dispatch({
      type: ActionType.Gmail.Thread.STAR_REQUEST,
      threadID,
    });

    ThreadAPI.star({threadID}).then(() =>
      dispatch({
        type: ActionType.Gmail.Thread.STAR_SUCCESS,
        threadID,
      })
    ).catch(error =>
      dispatch({
        type: ActionType.Gmail.Thread.STAR_FAILURE,
        threadID,
        error,
      })
    );
  };
}

export function unstar(threadID: string) {
  return dispatch => {
    dispatch({
      type: ActionType.Gmail.Thread.UNSTAR_REQUEST,
      threadID,
    });

    ThreadAPI.unstar({threadID}).then(() =>
      dispatch({
        type: ActionType.Gmail.Thread.UNSTAR_SUCCESS,
        threadID,
      })
    ).catch(error =>
      dispatch({
        type: ActionType.Gmail.Thread.UNSTAR_FAILURE,
        threadID,
        error,
      })
    );
  };
}
