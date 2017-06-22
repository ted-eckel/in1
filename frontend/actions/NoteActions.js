import * as APIUtil from '../util/NoteAPI'
import ActionType from '../actions/ActionType'

export const fetchNotes = (search = '', requestedResultCount = 20) => (dispatch, getState) => {
  const noteList = getState().notes.noteListBySearch[search];

  let offset = 0;
  if (noteList) {
    offset = noteList.nextOffset;
    let status = noteList.status;
    if (status === 2) {
      return;
    }
  }

  dispatch({
    type: ActionType.App.Notes.FETCH_REQUEST,
    search,
    requestedResultCount
  })

  return APIUtil.fetchNotes({
    count: requestedResultCount,
    offset
  })
  .then(response => {
    dispatch(receiveNotes(response, search))
  }, error => {
    return dispatch(receiveError(error))
  });
}

export const receiveNotes = (response, search) => (
  {
    type: ActionType.App.Notes.FETCH_SUCCESS,
    search,
    status: response.moreNotesStatus,
    notes: response.notes.map(note => {
      let c = new Date(note.created_at);
      let u = new Date(note.updated_at);
      let content = note.content ? note.content : "";
      return {
        service: 'in1box',
        date: c,
        note: {
          drive_attachment_ids: note.drive_attachment_ids,
          color: note.color,
          content: APIUtil.htmlConvert(content),
          created_at: c,
          id: note.id,
          state: note.state,
          tags: note.tags,
          title: note.title,
          updated_at: u,
          htmlContent: content,
        },
        id: note.id,
      }
    })
  }
)

export const receiveError = error => ({
  type: ActionType.App.Notes.FETCH_FAILURE,
  error
})

export const createNote = note => dispatch => {
  dispatch({
    type: ActionType.App.Notes.CREATE_NOTE_REQUEST,
    note
  })

  return APIUtil.createNotes({
    notes: [note]
  }).then(response => {
    let note = response.notes[0]
    let c = new Date(note.created_at)
    let u = new Date(note.updated_at)
    let content = note.content ? note.content : "";
    dispatch({
      type: ActionType.App.Notes.CREATE_NOTE_SUCCESS,
      note: {
        service: 'in1box',
        date: c,
        note: {
          drive_attachment_ids: note.drive_attachment_ids,
          color: note.color,
          content: APIUtil.htmlConvert(content),
          created_at: c,
          id: note.id,
          state: note.state,
          tags: note.tags,
          title: note.title,
          updated_at: u,
          htmlContent: content,
        },
        id: note.id,
      }
    })
  }, error => {
    dispatch({type: ActionType.App.Notes.CREATE_NOTE_FAILURE, error})
  })
}

export const updateNote = (noteID, actions) => dispatch => {
  dispatch({
    type: ActionType.App.Notes.UPDATE_NOTE_REQUEST,
    actions
  })

  return APIUtil.modifyNote(noteID, actions).then(response => {
    let note = response;
    let c = new Date(note.created_at)
    let u = new Date(note.updated_at)
    let content = note.content ? note.content : "";
    dispatch({
      type: ActionType.App.Notes.UPDATE_NOTE_SUCCESS,
      note: {
        service: 'in1box',
        date: c,
        note: {
          drive_attachment_ids: note.drive_attachment_ids,
          color: note.color,
          content: APIUtil.htmlConvert(content),
          created_at: c,
          id: note.id,
          state: note.state,
          tags: note.tags,
          title: note.title,
          updated_at: u,
          htmlContent: content,
        },
        id: note.id,
      }
    })
  }, error => {
    dispatch({type: ActionType.App.Notes.UPDATE_NOTE_FAILURE}, error)
  })
}

export const uploadNotes = notesArray => dispatch => {
  dispatch({
    type: ActionType.App.Notes.UPLOAD_NOTES_REQUEST,
    notesArray
  })

  return APIUtil.createNotes({
    notes: notesArray
  }).then(success => {
    dispatch({type: ActionType.App.Notes.UPLOAD_NOTES_SUCCESS, success})
  }, error => {
    dispatch({type: ActionType.App.Notes.UPLOAD_NOTES_FAILURE, error})
  })
}

export const deleteNotes = noteIDsArray => dispatch => {
  dispatch({
    type: ActionType.App.Notes.DELETE_REQUEST,
    noteIDsArray
  })

  return APIUtil.deleteNotes({
    note_ids: noteIDsArray
  }).then(success => {
    dispatch({type: ActionType.App.Notes.DELETE_SUCCESS, success})
  }, error => {
    dispatch({type: ActionType.App.Notes.DELETE_FAILURE, error})
  })
}

export const trashNote = noteID => dispatch => {
  dispatch({
    type: ActionType.App.Notes.TRASH_REQUEST,
    noteID
  })

  return APIUtil.modifyNote(noteID, {state: 'TRASH'}).then(success => {
    dispatch({type: ActionType.App.Notes.TRASH_SUCCESS, success})
  }, error => {
    dispatch({type: ActionType.App.Notes.TRASH_FAILURE, error})
  })
}

export const archiveNote = noteID => dispatch => {
  dispatch({
    type: ActionType.App.Notes.ARCHIVE_REQUEST,
    noteID
  })

  return APIUtil.modifyNote(noteID, {state: 'ARCHIVE'}).then(success => {
    dispatch({type: ActionType.App.Notes.ARCHIVE_SUCCESS, success})
  }, error => {
    dispatch({type: ActionType.App.Notes.ARCHIVE_FAILURE, error})
  })
}

export const unarchiveNote = noteID => dispatch => {
  dispatch({
    type: ActionType.App.Notes.UNARCHIVE_REQUEST,
    noteID
  })

  return APIUtil.modifyNote(noteID, {state: 'INBOX'}).then(success => {
    dispatch({type: ActionType.App.Notes.UNARCHIVE_SUCCESS, success})
  }, error => {
    dispatch({type: ActionType.App.Notes.UNARCHIVE_FAILURE, error})
  })
}
