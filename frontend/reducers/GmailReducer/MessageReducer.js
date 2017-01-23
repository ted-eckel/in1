/** @flow */

import ActionType from '../../actions/ActionType'
import filter from 'lodash/filter'

module.exports = (messagesByID = {}, action) => {
  switch (action.type) {
    case ActionType.Gmail.Thread.LOAD_SUCCESS:
    case ActionType.Gmail.Thread.LOAD_LIST_SUCCESS:
      return action.messages.reduce(
        (newMessagesByID, message) => {
          newMessagesByID[message.id] = message
          return newMessagesByID;
        },
        {...messagesByID},
      );

    case ActionType.Gmail.Thread.MARK_AS_READ_REQUEST:
      return _updateMessagesWhere(
        messagesByID,
        {threadID: action.threadID, isUnread: true},
        {isUnread: false},
      );

    case ActionType.Gmail.Thread.MARK_AS_UNREAD_REQUEST:
      return _updateMessagesWhere(
        messagesByID,
        {threadID: action.threadID, isUnread: false},
        {isUnread: true},
      );

    case ActionType.Gmail.Thread.ARCHIVE_REQUEST:
      return _updateMessagesWhere(
        messagesByID,
        {threadID: action.threadID, isInInbox: true},
        {isInInbox: false},
      );

    case ActionType.Gmail.Thread.STAR_REQUEST:
      return _updateMessagesWhere(
        messagesByID,
        {threadID: action.threadID, isStarred: false},
        {isStarred: true},
      );

    case ActionType.Gmail.Thread.UNSTAR_REQUEST:
      return _updateMessagesWhere(
        messagesByID,
        {threadID: action.threadID, isStarred: true},
        {isStarred: false},
      );
  }
  return messagesByID;
};

function _updateMessagesWhere(messagesByID, where, updates) {
  const newMessagesByID = {...messagesByID};
  const updatedMessages = filter(messagesByID, where)
    .map(message => ({...message, ...updates}))
    .forEach(message => newMessagesByID[message.id] = message);

  return newMessagesByID;
}
