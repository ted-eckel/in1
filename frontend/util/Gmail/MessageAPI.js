/** @flow */

const ActionType = require('./ActionType');
const MessageTranslator = require('./MessageTranslator');

import type {TMessage} from './Types';
type Message = typeof TMessage;

function getByIDs(
  options: {ids: Array<string>}
): Promise<Array<Message>> {
  const batch = window.gapi.client.newBatch();
  options.ids.forEach(id => {
    batch.add(
      window.gapi.client.gmail.users.messages.get({userId: 'me', id}),
      {id}
    );
  });
  return window.gapi.Batch.then(
    response => options.ids.map(messageID => {
      return MessageTranslator.translate(response[messageID].result);
    })
  );
}

module.exports = {
  getByIDs,
};
