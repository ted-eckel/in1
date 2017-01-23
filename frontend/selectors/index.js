import { createSelector } from 'reselect'
import last from 'lodash/last'

import getUnsubscribeUrl from '../util/Gmail/getUnsubscribeUrl'

export const itemsSelector = state => state.pocket.items;
export const isFetchingSelector = state => state.pocket.isFetching;
export const errorSelector = state => state.pocket.error;
export const drawerOpenSelector = state => state.app.drawerOpen;

export const isRequestingSelector = state => state.isRequesting;

const threadListByQuerySelector = state => state.gmail.threadListByQuery;
const threadsByIDSelector = state => state.gmail.threadsByID;
export const messagesByIDSelector = state => state.gmail.messagesByID;

export const isAuthorizedSelector = state => state.gmail.authorization.isAuthorized;
export const isAuthorizingSelector = state => state.gmail.authorization.isAuthorizing;
export const isLoadingSelector = state => state.gmail.isLoading;
export const labelsSelector = state => state.gmail.labels;
export const searchQuerySelector = state => state.gmail.app.searchQuery;
// export const selectedMessageIDSelector = state => state.routing.params.messageID;
// export const selectedThreadIDSelector = state => state.routing.params.threadID;

export const threadsSelector = createSelector([
  searchQuerySelector,
  threadListByQuerySelector,
  threadsByIDSelector,
], (
  searchQuery,
  threadListByQuery,
  threadsByID,
) => {
  const threadList = threadListByQuery[searchQuery];
  return threadList ?
    threadList.threadIDs.map(threadID => threadsByID[threadID]) :
    [];
});

// export const selectedThreadMessagesSelector = createSelector([
//   threadsByIDSelector,
//   selectedThreadIDSelector,
//   messagesByIDSelector,
// ], (
//   threadsByID,
//   selectedThreadID,
//   messagesByID,
// ) => {
//   const selectedThread = threadsByID[selectedThreadID];
//   return selectedThread &&
//     selectedThread.messageIDs.map(messageID => messagesByID[messageID]);
// });

// export const unsubscribeUrlSelector = createSelector([
//   selectedThreadMessagesSelector,
//   selectedMessageIDSelector,
// ], (
//   messages,
//   selectedMesageID,
// ) => {
//   const selectedMessage = messages && messages.find(
//     message => message.id === selectedMesageID
//   );
//
//   return selectedMessage && getUnsubscribeUrl(selectedMessage);
// });

export const lastMessageInEachThreadSelector = createSelector([
  messagesByIDSelector,
  threadsSelector
], (
  messagesByID,
  threads
) => {
  return threads && threads.map(
    thread => messagesByID[_.last(thread.messageIDs)]
  );
});

export const hasMoreThreadsSelector = createSelector([
  searchQuerySelector,
  threadListByQuerySelector,
], (
  searchQuery,
  threadListByQuery,
) => {
  const threadList = threadListByQuery[searchQuery];
  return !threadList || !!threadList.nextPageToken;
});

export const loadedThreadCountSelector = createSelector([
  searchQuerySelector,
  threadListByQuerySelector,
], (
  searchQuery,
  threadListByQuery,
) => {
  const threadList = threadListByQuery[searchQuery];
  return threadList ? threadList.threadIDs.length : 0;
});

// export const nextMessageSelector = createSelector([
//   lastMessageInEachThreadSelector,
//   selectedMessageIDSelector,
// ], (
//   messages,
//   selectedMessageID
// ) => {
//   if (!messages) {
//     return null;
//   }
//
//   const selectedMessageIndex = selectedMessageID &&
//     messages.findIndex(
//       msg => msg.id === selectedMessageID
//     );
//
//   if (!selectedMessageID) {
//     return messages[0];
//   } else if (selectedMessageIndex < 0 || selectedMessageIndex === messages.length) {
//     return null;
//   } else {
//     return messages[selectedMessageIndex + 1];
//   }
// });

// export const prevMessageSelector = createSelector([
//   lastMessageInEachThreadSelector,
//   selectedMessageIDSelector,
// ], (
//   messages,
//   selectedMessageID
// ) => {
//   if (!messages) {
//     return null;
//   }
//
//   const selectedMessageIndex = selectedMessageID &&
//     messages.findIndex(
//       msg => msg.id === selectedMessageID
//     );
//
//   if (!selectedMessageID) {
//     return messages[0];
//   } else if (selectedMessageIndex < 0 || selectedMessageIndex === 0) {
//     return null;
//   } else {
//     return messages[selectedMessageIndex - 1];
//   }
// });
