const ActionType = {
  App: {
    Functionality: {
      SEARCH: '',
    },

    Items: {
      FETCH_SUCCESS: '',
    },

    Request: {
      START: '',
      ALL_STOPPED: '',
    },

    View: {
      TOGGLE_DRAWER: '',
      TOGGLE_LIST_TYPE: '',
    },

    Session: {
      LOGIN: '',
      LOGOUT: '',
      SIGNUP: '',
      RECEIVE_CURRENT_USER: '',
      RECEIVE_ERRORS: '',
    },
  },

  Drive: {
    App: {
      SEARCH: '',
    },

    Authorization: {
      REQUEST: '',
      SUCCESS: '',
      FAILURE: '',
    },

    File: {
      ARCHIVE_REQUEST: '',
      ARCHIVE_SUCCESS: '',
      ARCHIVE_FAILURE: '',

      FETCH_REQUEST: '',
      FETCH_SUCCESS: '',
      FETCH_FAILURE: '',

      FETCH_LIST_REQUEST: '',
      FETCH_LIST_SUCCESS: '',
      FETCH_LIST_FAILURE: '',

      STAR_REQUEST: '',
      STAR_SUCCESS: '',
      STAR_FAILURE: '',

      UNSTAR_REQUEST: '',
      UNSTAR_SUCCESS: '',
      UNSTAR_FAILURE: '',
    },
  },

  Gmail: {
    App: {
      SEARCH: '',
    },

    Authorization: {
      REQUEST: '',
      SUCCESS: '',
      FAILURE: '',
    },

    Label: {
      FETCH_ALL_REQUEST: '',
      FETCH_ALL_SUCCESS: '',
      FETCH_ALL_FAILURE: '',
    },

    Message: {
      SELECT: '',
    },

    Request: {
      START: '',
      ALL_STOPPED: '',
    },

    Thread: {
      FETCH_REQUEST: '',
      FETCH_SUCCESS: '',
      FETCH_FAILURE: '',

      FETCH_LIST_REQUEST: '',
      FETCH_LIST_SUCCESS: '',
      FETCH_LIST_FAILURE: '',

      ARCHIVE_REQUEST: '',
      ARCHIVE_SUCCESS: '',
      ARCHIVE_FAILURE: '',

      MOVE_TO_INBOX_REQUEST: '',
      MOVE_TO_INBOX_SUCCESS: '',
      MOVE_TO_INBOX_FAILURE: '',

      MARK_AS_READ_REQUEST: '',
      MARK_AS_READ_SUCCESS: '',
      MARK_AS_READ_FAILURE: '',

      MARK_AS_UNREAD_REQUEST: '',
      MARK_AS_UNREAD_SUCCESS: '',
      MARK_AS_UNREAD_FAILURE: '',

      REFRESH: '',

      STAR_REQUEST: '',
      STAR_SUCCESS: '',
      STAR_FAILURE: '',

      UNSTAR_REQUEST: '',
      UNSTAR_SUCCESS: '',
      UNSTAR_FAILURE: '',

      TRASH_REQUEST: '',
      TRASH_SUCCESS: '',
      TRASH_FAILURE: '',
    }
  },

  Pocket: {
    App: {
      SEARCH: '',
    },

    Authorization: {
      REQUEST: '',
      SUCCESS: '',
      FAILURE: '',
    },

    Items: {
      FETCH_REQUEST: '',
      FETCH_SUCCESS: '',
      FETCH_FAILURE: '',
      END_OF_LIST: '',

      ARCHIVE_REQUEST: '',
      ARCHIVE_SUCCESS: '',
      ARCHIVE_FAILURE: '',

      DELETE_REQUEST: '',
      DELETE_SUCCESS: '',
      DELETE_FAILURE: '',

      UNARCHIVE_REQUEST: '',
      UNARCHIVE_SUCCESS: '',
      UNARCHIVE_FAILURE: '',
    },
  },
};

const ActionTypeHax = ActionType;
Object.keys(ActionTypeHax).forEach(service => {
  Object.keys(ActionTypeHax[service]).forEach(category => {
    Object.keys(ActionTypeHax[service][category]).forEach(actionType => {
      ActionTypeHax[service][category][actionType] = service + '.' + category + '.' + actionType;
    });
  });
});

export default ActionType
