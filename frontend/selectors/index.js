import { createSelector } from 'reselect'
import last from 'lodash/last'
import slice from 'lodash/slice'
import union from 'lodash/union'
import concat from 'lodash/concat'


export const itemsSelector = state => state.pocket.items;
export const pocketIsFetchingSelector = state => state.pocket.isFetching;
export const errorSelector = state => state.pocket.error;
export const endOfListSelector = state => state.pocket.endOfList;

export const drawerOpenSelector = state => state.app.drawerOpen;

export const identitiesSelector = state => state.session.currentUser.identities;

const threadListByQuerySelector = state => state.gmail.threadListByQuery;
const threadsByIDSelector = state => state.gmail.threadsByID;
export const messagesByIDSelector = state => state.gmail.messagesByID;
export const isAuthorizedSelector = state => state.gmail.authorization.isAuthorized;
export const isAuthorizingSelector = state => state.gmail.authorization.isAuthorizing;
export const labelsSelector = state => state.gmail.labels;
export const searchQuerySelector = state => state.gmail.app.searchQuery;

export const driveIsAuthorizedSelector = state => state.drive.authorization.isAuthorized;
export const driveIsAuthorizingSelector = state => state.drive.authorization.isAuthorizing;

export const gmailIsFetchingSelector = state => state.gmail.isFetching;
export const driveIsFetchingSelector = state => state.drive.isFetching;

export const drivePageTokenSelector = state => state.drive.nextPageToken;
export const driveFilesSelector = state => state.drive.fileList;

export const pocketAuthSelector = state => state.pocket.authorization.isAuthorized;
export const servicesSelector = state => state.services;

export const isFetchingSelector = createSelector([
  pocketIsFetchingSelector,
  driveIsFetchingSelector,
  gmailIsFetchingSelector
], (
  pocketIsFetching,
  driveIsFetching,
  gmailIsFetching
) => {
  let anyAreFetching = false;
  if (
    pocketIsFetching ||
    driveIsFetching ||
    gmailIsFetching
  ) {anyAreFetching = true};
  return {
    any: anyAreFetching,
    pocket: pocketIsFetching,
    drive: driveIsFetching,
    gmail: gmailIsFetching
  }
})

export const allAuthSelector = createSelector([
  pocketAuthSelector,
  isAuthorizedSelector,
  driveIsAuthorizedSelector
], (
  pocketAuth,
  gmailAuth,
  driveAuth
) => {
  let allAuth = null;
  if (
    pocketAuth !== null &&
    gmailAuth !== null &&
    driveAuth !== null
  ) { allAuth = true };
  return {
    all: allAuth,
    pocket: pocketAuth,
    gmail: gmailAuth,
    drive: driveAuth
  }
})

export const allAccountsCountSelector = createSelector([
  identitiesSelector,
  isAuthorizedSelector
], (
  identities,
  isAuthorized
) => {
  let gmail = isAuthorized ? 1 : 0;
  return identities.length + gmail;
})

export const allAccountsSelector = createSelector([
  identitiesSelector,
  isAuthorizedSelector,
  isAuthorizingSelector,
  driveIsAuthorizedSelector,
  driveIsAuthorizingSelector
], (
  identities,
  isAuthorized,
  isAuthorizing,
  driveIsAuthorized,
  driveIsAuthorizing
) => {
  let accounts = [];
  if (identities.length === 1) {
    accounts.push('pocket');
  }
  if (isAuthorized && !isAuthorizing){
    accounts.push('gmail')
  }
  if (driveIsAuthorized && !driveIsAuthorizing){
    accounts.push('drive')
  }

  return accounts;
})

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

export const getAllItemsSelector = createSelector([
  lastMessageInEachThreadSelector,
  itemsSelector,
  driveFilesSelector,
  isFetchingSelector
], (
    lastMessageInEachThread,
    items,
    driveFiles,
    isFetching
  ) => concat(items, lastMessageInEachThread, driveFiles).sort((a, b) => b.date - a.date) /*items.concat(lastMessageInEachThread).sort((a, b) => b.date - a.date)*/
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
