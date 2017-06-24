import { createSelector } from 'reselect'
import last from 'lodash/last'
import slice from 'lodash/slice'
import union from 'lodash/union'
import concat from 'lodash/concat'


// export const itemsSelector = state => state.pocket.items;
export const pocketIsFetchingSelector = state => state.pocket.isFetching;
export const errorSelector = state => state.pocket.error;
// export const endOfListSelector = state => state.pocket.endOfList;

export const drawerOpenSelector = state => state.app.drawerOpen;
export const keepModalOpenSelector = state => state.app.keepModalOpen;
export const createNoteModalOpenSelector = state => state.app.createNoteModalOpen;

export const identitiesSelector = state => state.session.currentUser.identities;
export const currentUserSelector = state => state.session.currentUser;
export const googleUserSelector = state => state.session.googleUser;

const threadListByQuerySelector = state => state.gmail.threadListByQuery;
export const threadsByIDSelector = state => state.gmail.threadsByID;
export const messagesByIDSelector = state => state.gmail.messagesByID;
export const isAuthorizedSelector = state => state.gmail.authorization.isAuthorized;
export const isAuthorizingSelector = state => state.gmail.authorization.isAuthorizing;
export const labelsSelector = state => state.gmail.labels;
export const searchQuerySelector = state => state.gmail.app.searchQuery;

export const driveIsAuthorizedSelector = state => state.drive.authorization.isAuthorized;
export const driveIsAuthorizingSelector = state => state.drive.authorization.isAuthorizing;

export const gmailIsFetchingSelector = state => state.gmail.isFetching;
export const driveIsFetchingSelector = state => state.drive.isFetching;
// export const driveFilesSelector = state => state.drive.fileList;
export const notesIsFetchingSelector = state => state.notes.isFetching;
export const createdNoteSelector = state => state.notes.createdNote;

export const pocketAuthSelector = state => state.pocket.authorization.isAuthorized;

export const isFetchingSelector = createSelector([
  pocketIsFetchingSelector,
  driveIsFetchingSelector,
  gmailIsFetchingSelector,
  notesIsFetchingSelector,
], (
  pocketIsFetching,
  driveIsFetching,
  gmailIsFetching,
  notesIsFetching,
) => {
  let anyAreFetching = false;
  if (
    pocketIsFetching ||
    driveIsFetching ||
    gmailIsFetching ||
    notesIsFetching
  ) {anyAreFetching = true};
  return {
    any: anyAreFetching,
    pocket: pocketIsFetching,
    drive: driveIsFetching,
    gmail: gmailIsFetching,
    notes: notesIsFetching,
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
  let countAuth = 0;
  if (
    pocketAuth !== null &&
    gmailAuth !== null &&
    driveAuth !== null
  ) { allAuth = true };
  if (pocketAuth === true) { countAuth += 1 }
  if (gmailAuth === true) { countAuth += 1 }
  if (driveAuth === true) { countAuth += 1 }
  return {
    all: allAuth,
    pocket: pocketAuth,
    gmail: gmailAuth,
    drive: driveAuth,
    count: countAuth
  }
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

export const pocketSearchSelector = state => state.pocket.app.search;
export const pocketItemListBySearchSelector = state => state.pocket.itemListBySearch;
export const pocketItemsByIDSelector = state => state.pocket.itemsByID;

export const itemsSelector = createSelector([
  pocketSearchSelector,
  pocketItemListBySearchSelector,
  pocketItemsByIDSelector,
], (
  search,
  itemListBySearch,
  itemsByID
) => {
  const itemsList = itemListBySearch[search];
  return itemsList ?
    itemsList.itemIDs.map(itemID => itemsByID[itemID]) :
    [];
});

export const appSearchSelector = state => state.app.search;
export const noteListBySearchSelector = state => state.notes.noteListBySearch;
export const notesByIDSelector = state => state.notes.notesByID;

export const notesSelector = createSelector([
  appSearchSelector,
  noteListBySearchSelector,
  notesByIDSelector
], (
  appSearch,
  noteListBySearch,
  notesByID
) => {
  const notesList = noteListBySearch[appSearch];
  return notesList ?
    notesList.noteIDs.map(noteID => notesByID[noteID]) :
    [];
});

export const driveQuerySelector = state => state.drive.app.searchQuery;
export const driveFileListByQuerySelector = state => state.drive.fileListByQuery;
export const driveFilesByIDSelector = state => state.drive.filesByID;

export const driveFilesSelector = createSelector([
  driveQuerySelector,
  driveFileListByQuerySelector,
  driveFilesByIDSelector
], (
  query,
  fileListByQuery,
  filesByID
) => {
  const fileList = fileListByQuery[query];
  return fileList ?
    fileList.fileIDs.map(fileID => filesByID[fileID]) :
    [];
});

export const driveHasMoreFilesSelector = createSelector([
  driveQuerySelector,
  driveFileListByQuerySelector
], (
  query,
  fileListByQuery
) => {
  const fileList = fileListByQuery[query];
  return !fileList || !!fileList.nextPageToken;
});

export const pocketHasMoreItemsSelector = createSelector([
  pocketSearchSelector,
  pocketItemListBySearchSelector,
], (
  search,
  itemListBySearch
) => {
  const itemList = itemListBySearch[search];
  return !itemList || itemList.status === 1;
})

export const in1boxHasMoreNotesSelector = createSelector([
  appSearchSelector,
  noteListBySearchSelector,
], (
  search,
  noteListBySearch
) => {
  const noteList = noteListBySearch[search];
  return !noteList || noteList.status === 1;
})

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

export const endOfListSelector = createSelector([
  pocketHasMoreItemsSelector,
  hasMoreThreadsSelector,
  driveHasMoreFilesSelector,
  in1boxHasMoreNotesSelector,
  allAuthSelector
], (
  pocketHasMoreItems,
  gmailHasMoreThreads,
  driveHasMoreFiles,
  in1boxHasMoreNotes,
  allAuth
) => {
  if (allAuth.pocket && pocketHasMoreItems) {
    return false
  }

  if (allAuth.gmail && gmailHasMoreThreads) {
    return false
  }

  if (allAuth.drive && driveHasMoreFiles) {
    return false
  }

  if (in1boxHasMoreNotes) {
    return false
  }

  return true;
})

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
  threadsSelector,
  googleUserSelector,
], (
  messagesByID,
  threads,
  googleUser,
) => {
  return threads && threads.map(
    thread => {
      let idx = thread.messageIDs.length - 1;
      let lastMessage = messagesByID[last(thread.messageIDs)];
      while (idx >= 0) {
        let message = messagesByID[thread.messageIDs[idx]]
        if (message.from.email !== googleUser) {
          lastMessage.date = message.messageDate;
          break;
        }
        idx -= 1;
      }
      return lastMessage;
    }
  );
});

// export const lastReceivedMessageInEachThreadSelector = createSelector([
//   messagesByIDSelector,
//   threadsSelector
// ], (
//   messagesByID,
//   threads
// ) => {
//   let messagesByIDArray = messagesByID;
//   messagesByIDArray.reverse().forEach((messageID, idx) => {
//
//   });
//
//   return threads && threads.map(
//     thread =>
//   )
// })

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
  notesSelector,
  driveFilesSelector,
  isFetchingSelector,
  allAuthSelector,
], (
    lastMessageInEachThread,
    items,
    notes,
    driveFiles,
    isFetching,
    allAuth,
  ) => {
    let driveCurrent;
    let gmailCurrent;
    let pocketCurrent;
    let notesCurrent;

    if (allAuth.all) {
      if (isFetching.pocket) {
        pocketCurrent = Object.freeze(items);
      }

      if (isFetching.gmail) {
        gmailCurrent = Object.freeze(lastMessageInEachThread);
      }

      if (isFetching.drive) {
        driveCurrent = Object.freeze(driveFiles);
      }

      if (isFetching.notes) {
        notesCurrent = Object.freeze(notes);
      }

      if (isFetching.any) {
        let allTheItems = concat(pocketCurrent, gmailCurrent, driveCurrent, notesCurrent).sort((a, b) => b.date - a.date);
        // console.log(allTheItems);
        return allTheItems
        // return concat(pocketCurrent, gmailCurrent, driveCurrent, notesCurrent).sort((a, b) => b.date - a.date);
      } else {
        pocketCurrent = null;
        driveCurrent = null;
        gmailCurrent = null;
        notesCurrent = null;
        let allTheItems = concat(items, lastMessageInEachThread, driveFiles, notes).sort((a, b) => b.date - a.date);
        // console.log(allTheItems)
        return allTheItems;
        // return concat(items, lastMessageInEachThread, driveFiles, notes).sort((a, b) => b.date - a.date);
      }
    } else {
      return [];
    }
  }
);
