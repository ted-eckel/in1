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
      TOGGLE_KEEP_MODAL: '',

      TOGGLE_CREATE_NOTE_MODAL: '',
    },

    Session: {
      LOGIN: '',
      LOGOUT: '',
      SIGNUP: '',
      RECEIVE_CURRENT_USER: '',
      RECEIVE_GOOGLE_USER: '',
      RECEIVE_ERRORS: '',
    },

    Uploads: {
      SET_FOLDER_ID: '',
    },

    Notes: {
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

      TRASH_REQUEST: '',
      TRASH_SUCCESS: '',
      TRASH_FAILURE: '',

      UNARCHIVE_REQUEST: '',
      UNARCHIVE_SUCCESS: '',
      UNARCHIVE_FAILURE: '',

      CREATE_NOTE_REQUEST: '',
      CREATE_NOTE_SUCCESS: '',
      CREATE_NOTE_FAILURE: '',

      UPDATE_NOTE_REQUEST: '',
      UPDATE_NOTE_SUCCESS: '',
      UPDATE_NOTE_FAILURE: '',

      UPLOAD_NOTES_REQUEST: '',
      UPLOAD_NOTES_SUCCESS: '',
      UPLOAD_NOTES_FAILURE: '',

      UPDATE_CREATED_NOTE_TITLE: '',
      UPDATE_CREATED_NOTE_CONTENT: '',
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

      MOVE_TO_INBOX_REQUEST: '',
      MOVE_TO_INBOX_SUCCESS: '',
      MOVE_TO_INBOX_FAILURE: '',

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
