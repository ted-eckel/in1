/** @flow */

import ActionType from '../../actions/ActionType'
import API from './API'
import map from 'lodash/map'
import MessageTranslator from './MessageTranslator'

export function getByID(
  options: {id: string}
): Promise<Object> {
  return API.wrap(() => {
    return API.execute(
      window.gapi.client.gmail.users.threads.get({userId: 'me', id: options.id})
    ).then(response => {
      const {threads, messages} = processThreadResults([response.result]);
      return {
        messages,
        thread: threads[0],
      };
    });
  });
}

declare class ListResult {
  nextPageToken: ?string;
  resultSizeEstimate: number;
  items: Array<Object>;
}

export function list(
  options: {maxResults: number; query: ?string; pageToken: ?string}
): Promise<ListResult> {
  return API.wrap(() => {
    return API.execute(window.gapi.client.gmail.users.threads.list({
      userId: 'me',
      maxResults: options.maxResults,
      labelIds: 'INBOX',
      q: options.query || null,
      pageToken: options.pageToken || null,
    })).then(listResponse => {
      const threadIDs = (listResponse.threads || []).map(m => m.id);

      if (!threadIDs.length) {
        return Promise.resolve({
          nextPageToken: null,
          resultSizeEstimate: 0,
          threads: [],
          messages: [],
        });
      }

      const batch = window.gapi.client.newHttpBatch();
      threadIDs.forEach(id => {
        batch.add(
          window.gapi.client.gmail.users.threads.get({userId: 'me', id}),
          {id}
        );
      });

      return API.execute(batch).then(batchResponse => {
        const results = threadIDs.map(threadID => batchResponse[threadID].result);
        const {threads, messages} = processThreadResults(results);

        return {
          nextPageToken: listResponse.nextPageToken,
          resultSizeEstimate: listResponse.resultSizeEstimate,
          threads,
          messages,
        };
      });
    });
  });
}

function processThreadResults(results) {
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
  return API.wrap(() =>
    API.execute(window.gapi.client.gmail.users.threads.modify({
      userId: 'me',
      id: options.threadID,
      removeLabelIds: ['UNREAD'],
    }))
  );
}

export function archive(options: {threadID: string}) {
  return API.wrap(() =>
    API.execute(window.gapi.client.gmail.users.threads.modify({
      userId: 'me',
      id: options.threadID,
      removeLabelIds: ['INBOX'],
    }))
  );
}

export function moveToInbox(options: {threadID: string}) {
  return API.wrap(() =>
    API.execute(window.gapi.client.gmail.users.threads.modify({
      userId: 'me',
      id: options.threadID,
      addLabelIds: ['INBOX'],
    }))
  );
}

export function markAsUnread(options: {threadID: string}) {
  return API.wrap(() =>
    API.execute(window.gapi.client.gmail.users.threads.modify({
      userId: 'me',
      id: options.threadID,
      addLabelIds: ['UNREAD'],
    }))
  );
}

export function unstar(options: {threadID: string}) {
  return API.wrap(() =>
    API.execute(window.gapi.client.gmail.users.threads.modify({
      userId: 'me',
      id: options.threadID,
      removeLabelIds: ['STARRED'],
    }))
  );
}

export function star(options: {threadID: string}) {
  return API.wrap(() =>
    API.execute(window.gapi.client.gmail.users.threads.modify({
      userId: 'me',
      id: options.threadID,
      addLabelIds: ['STARRED'],
    }))
  );
}
