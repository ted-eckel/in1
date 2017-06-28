/** @flow */

import ActionType from '../../actions/ActionType'
import map from 'lodash/map'
import MessageTranslator from './MessageTranslator'

export function getByID(options: {id: string}) {
  return window.gapi.client.gmail.users.threads.get({userId: 'me', id: options.id})
  .then(response => {
    const {threads, messages} = processThreadResults([response.result]);
    return {
      messages,
      thread: threads[0],
    }
  })
}

export const list = (options) => {
  let label = null;
  if (!options.query) {label = 'INBOX'};
  return window.gapi.client.gmail.users.threads.list({
    userId: 'me',
    maxResults: options.maxResults,
    labelIds: label,
    q: options.query || null,
    pageToken: options.pageToken || null,
  }).then(listResponse => {
    const threadIDs = (listResponse.result.threads || []).map(m => m.id);

    if (!threadIDs.length) {
      return {
        nextPageToken: null,
        resultSizeEstimate: 0,
        threads: [],
        messages: [],
      };
    }

    const batch = window.gapi.client.newBatch();

    const threadRequest = id => {
      return window.gapi.client.gmail.users.threads.get({userId: 'me', id})
    }

    threadIDs.forEach(id => {
      batch.add(threadRequest(id), {'id': id})
    })

    return batch.then(batchResponse => {
      const results = threadIDs.map(threadID => batchResponse.result[threadID].result);
      const {threads, messages} = processThreadResults(results);

      return {
        nextPageToken: listResponse.result.nextPageToken,
        resultSizeEstimate: listResponse.result.resultSizeEstimate,
        threads,
        messages,
      }
    })
  })
}

export const addLabels = (threadID, labelIDs, labelNames) => {
  const labelAddRequest = ids => {
    return window.gapi.client.gmail.users.threads.modify({
      userId: 'me',
      id: threadID,
      addLabelIds: ids
    })
  }

  if (labelNames.length) {
    const createLabelsBatch = window.gapi.client.newBatch();

    const labelCreateRequest = labelName => {
      return window.gapi.client.gmail.users.labels.create({
        userId: 'me',
        name: labelName
      })
    }

    labelNames.forEach(labelName => {
      createLabelsBatch.add(labelCreateRequest(labelName))
    })

    return createLabelsBatch.then(res => {
      let newLabelIds = labelIDs;
      let createdLabels = [];

      Object.keys(res.result).forEach(key => {
        createdLabels.push(res.result[key].result)
        newLabelIds.push(res.result[key].result.id)
      })

      return labelAddRequest(newLabelIds).then(res => res.result)
    })
  } else {
    labelAddRequest(labelIDs).then(res => res.result)
  }
}

export const removeLabel = (threadID, labelID) => {
  return window.gapi.client.gmail.users.threads.modify({
    userId: 'me',
    id: threadID,
    removeLabelIds: [labelID]
  })
}

export function processThreadResults(results) {
  const allMessages = [];
  const threads = results.filter(thread => thread).map(thread => {
    const messages = thread.messages.map(MessageTranslator.translate);
    allMessages.push.apply(allMessages, messages);
    return {
      id: thread.id,
      messageIDs: map(messages, 'id'),
    };
  });

  return {threads, messages: allMessages};
}

export function markAsRead(options: {threadID: string}) {
  return window.gapi.client.gmail.users.threads.modify({
    userId: 'me',
    id: options.threadID,
    removeLabelIds: ['UNREAD'],
  })
}

export function archive(options: {threadID: string}) {
  return window.gapi.client.gmail.users.threads.modify({
    userId: 'me',
    id: options.threadID,
    removeLabelIds: ['INBOX'],
  })
}

export function moveToInbox(options: {threadID: string}) {
  return window.gapi.client.gmail.users.threads.modify({
    userId: 'me',
    id: options.threadID,
    addLabelIds: ['INBOX'],
  })
}

export function markAsUnread(options: {threadID: string}) {
  return window.gapi.client.gmail.users.threads.modify({
    userId: 'me',
    id: options.threadID,
    addLabelIds: ['UNREAD'],
  })
}

export function unstar(options: {threadID: string}) {
  return window.gapi.client.gmail.users.threads.modify({
    userId: 'me',
    id: options.threadID,
    removeLabelIds: ['STARRED'],
  })
}

export function star(options: {threadID: string}) {
  return window.gapi.client.gmail.users.threads.modify({
    userId: 'me',
    id: options.threadID,
    addLabelIds: ['STARRED'],
  })
}

export function trash(options: {threadID: string}){
  return window.gapi.client.gmail.users.threads.trash({
    userId: 'me',
    id: options.threadID
  })
}
