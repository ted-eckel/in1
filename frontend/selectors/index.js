import { createSelector } from 'reselect'
import last from 'lodash/last'
import slice from 'lodash/slice'

import getUnsubscribeUrl from '../util/Gmail/getUnsubscribeUrl'

export const itemsSelector = state => state.pocket.items;
export const isFetchingSelector = state => state.pocket.isFetching;
export const errorSelector = state => state.pocket.error;
export const drawerOpenSelector = state => state.app.drawerOpen;

export const allItemsSelector = state => state.items.allItems;
export const servicesLoadedSelector = state => state.items.servicesLoaded;

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
    thread => messagesByID[last(thread.messageIDs)]
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

export const getAllItemsSelector = createSelector(
  lastMessageInEachThreadSelector,
  itemsSelector,
  (
    lastMessageInEachThread,
    items
  ) => items.concat(lastMessageInEachThread).sort((a, b) => b.date - a.date)
);

export const getAllItemsSelectorTwo = createSelector(
  messagesByIDSelector,
  itemsSelector,
  (
    messagesByID,
    items
  ) => {
    const messages = Object.keys(messagesByID).map((id => messagesByID[id]));
    return items.concat(messages).sort((a, b) => b.date - a.date)
  }
);

// export const getItemsInBatches = createSelector(
//   getAllItemsSelector,
//   ( getAllItems ) => slice(getAllItems, 0, 20)
// )
