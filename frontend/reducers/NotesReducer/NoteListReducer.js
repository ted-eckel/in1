import ActionType from '../../actions/ActionType'

export default (noteListBySearch = {}, action) => {
  const noteList = noteListBySearch[action.search];
  switch (action.type) {
    case ActionType.App.Notes.FETCH_REQUEST:
      if (noteList) {
        return {
          ...noteListBySearch,
          [action.search]: {
            ...noteList,
            isFetching: true,
          },
        }
      } else {
        return {
          ...noteListBySearch,
          [action.search]: {
            noteIDs: [],
            isFetching: true,
            nextOffset: 0,
            status: null
          }
        }
      }

    case ActionType.App.Notes.FETCH_SUCCESS:
      const newNoteIDs = action.notes.map(note => note.id);
      return {
        ...noteListBySearch,
        [action.search]: {
          noteIDs: [...noteList.noteIDs, ...newNoteIDs],
          isFetching: false,
          nextOffset: noteList.nextOffset + 20,
          status: action.status
        }
      }

    case ActionType.App.Notes.CREATE_NOTE_SUCCESS:
      let blankSearchNoteList = noteListBySearch[''];
      return {
        ...noteListBySearch,
        '': {
          ...blankSearchNoteList,
          noteIDs: [...blankSearchNoteList.noteIDs, action.note.id],
          nextOffset: blankSearchNoteList.nextOffset + 1,
        }
      }

    case ActionType.App.Notes.TRASH_REQUEST:
      return removeNote(noteListBySearch, action.noteID, /^$/);

    case ActionType.App.Notes.ARCHIVE_REQUEST:
      return removeNote(noteListBySearch, action.noteID, /^$/);

    case ActionType.App.Notes.UNARCHIVE_REQUEST:
      return removeMatchingSearches(noteListBySearch, /^$/);

    case ActionType.App.Notes.DELETE_REQUEST:
      return removeNote(noteListBySearch, action.noteID, /^$/);

    default:
      return noteListBySearch;
  }
}

function removeNote(noteListBySearch, noteIDToRemove, searchRegex) {
  return Object.keys(noteListBySearch)
    .reduce((newNoteListBySearch, search) => {
      if (searchRegex.test(search)) {
        const existingNoteList = noteListBySearch[search];
        const newNoteIDs = existingNoteList.noteIDs.filter(
          noteID => noteID !== noteIDToRemove
        );
        if (newNoteIDs.length < existingNoteList.noteIDs.length) {
          newNoteListBySearch[search] = {
            ...existingNoteList,
            noteIDs: newNoteIDs,
            nextOffset: existingNoteList.nextOffset - 1,
          };
        } else {
          newNoteListBySearch[search] = existingNoteList;
        }
      }

      return newNoteListBySearch;
    }, {});
}

function removeMatchingSearches(noteListBySearch, searchRegex) {
  return Object.keys(noteListBySearch)
    .reduce((newNoteListBySearch, search) => {
      if (!searchRegex.test(search)) {
        newNoteListBySearch[search] = noteListBySearch[search];
      }

      return newNoteListBySearch;
    }, {});
}
