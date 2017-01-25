const ActionType = {
  App: {
    Functionality: {
      SEARCH: '',
    },

    Request: {
      START: '',
      ALL_STOPPED: '',
    },

    View: {
      TOGGLE_DRAWER: '',
      TOGGLE_LIST_TYPE: '',
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
      LOAD_ALL_REQUEST: '',
      LOAD_ALL_SUCCESS: '',
      LOAD_ALL_FAILURE: '',
    },

    Message: {
      SELECT: '',
    },

    Request: {
      START: '',
      ALL_STOPPED: '',
    },

    Thread: {
      LOAD_REQUEST: '',
      LOAD_SUCCESS: '',
      LOAD_FAILURE: '',

      LOAD_LIST_REQUEST: '',
      LOAD_LIST_SUCCESS: '',
      LOAD_LIST_FAILURE: '',

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
    }
  },

  Pocket: {
    Items: {
      LOAD_REQUEST: '',
      LOAD_SUCCESS: '',
      LOAD_FAILURE: ''
    }
  }
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
