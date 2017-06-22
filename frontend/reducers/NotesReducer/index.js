import ActionType from '../../actions/ActionType'
import { combineReducers } from 'redux'
import NoteListReducer from './NoteListReducer'
import { htmlConvert } from '../../util/NoteAPI'
import { EditorState } from 'draft-js'

const notesByIDReducer = (notesByID = {}, action) => {
  switch (action.type) {
    case ActionType.App.Notes.FETCH_SUCCESS:
      return action.notes.reduce(
        (newNotesByID, note) => {
          newNotesByID[note.id] = note
          return newNotesByID
        },
        {...notesByID},
      );
    // case ActionType.App.Notes.CREATE_NOTE_REQUEST:
    case ActionType.App.Notes.CREATE_NOTE_SUCCESS:
      return {
        ...notesByID,
        [action.note.id]: action.note
      }
    case ActionType.App.Notes.UPDATE_NOTE_SUCCESS:
      return {
        ...notesByID,
        [action.note.id]: action.note
      }
    default:
      return notesByID;
  }
}

const isFetchingReducer = (state = false, action) => {
  switch (action.type) {
    case ActionType.App.Notes.FETCH_REQUEST:
      return true
    case ActionType.App.Notes.FETCH_SUCCESS:
      return false
    case ActionType.App.Notes.FETCH_FAILURE:
      return false
    default:
      return state;
  }
}

const errorReducer = (state = null, action) => {
  switch (action.type) {
    case ActionType.App.Notes.FETCH_FAILURE:
      return action.error
    default:
      return state;
  }
}

const createdNoteReducer = (state = {
  id: 'new',
  title: '',
  content: htmlConvert(''),
  tags: [],
  color: null,
  // drive_attachment_ids: null,
}, action) => {
  switch (action.type) {
    case ActionType.App.View.TOGGLE_CREATE_NOTE_MODAL:
      if (action.note) {
        const note = action.note;
        const title = note.title ? note.title : '';
        const id = note.id;
        const content = note.content;
        const tags = note.tags.map(tag => tag.name);
        const color = note.color;
        return {
          id,
          title,
          content,
          tags,
          color,
        }
      } else {
        return {
          id: 'new',
          title: '',
          content: htmlConvert(''),
          tags: [],
          color: null,
        }
      }
    default:
      return state;
  }
}

export default combineReducers({
  notesByID: notesByIDReducer,
  noteListBySearch: NoteListReducer,
  isFetching: isFetchingReducer,
  error: errorReducer,
  createdNote: createdNoteReducer,
})
