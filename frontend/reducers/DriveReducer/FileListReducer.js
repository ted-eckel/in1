import ActionType from '../../actions/ActionType'

export default (fileListByQuery = {}, action) => {
  const fileList = fileListByQuery[action.q];
  switch (action.type) {
    case ActionType.Drive.File.FETCH_LIST_REQUEST:
      if (fileList) {
        return {
          ...fileListByQuery,
          [action.q]: {
            ...fileList,
            isFetching: true,
          },
        }
      } else {
        return {
          ...fileListByQuery,
          [action.q]: {
            fileIDs: [],
            nextPageToken: null,
            isFetching: true,
          }
        }
      }

    case ActionType.Drive.File.FETCH_LIST_SUCCESS:
      const newFileIDs = action.files.map(file => file.id);
      return {
        ...fileListByQuery,
        [action.q]: {
          fileIDs: [...fileList.fileIDs, ...newFileIDs],
          nextPageToken: action.nextPageToken,
          isFetching: false
        }
      }


    case ActionType.Drive.File.REFRESH:
      return {};

    case ActionType.Drive.File.ARCHIVE_REQUEST:
      return removeFile(fileListByQuery, action.fileID,
        /mimeType != 'application\/vnd.google-apps.folder' and trashed = false/);

    case ActionType.Drive.File.MOVE_TO_INBOX_REQUEST:
      return removeMatchingQueries(fileListByQuery,
        /mimeType != 'application\/vnd.google-apps.folder' and trashed = false/);

    case ActionType.Drive.File.UNSTAR_REQUEST:
      return removeFile(
        fileListByQuery,
        action.fileID,
        /is\:\s*starred/
      );

    case ActionType.Drive.File.TRASH_REQUEST:
      return removeFile(fileListByQuery, action.fileID,
        /mimeType != 'application\/vnd.google-apps.folder' and trashed = false/);
  }
  return fileListByQuery;
};


function removeFile(fileListByQuery, fileIDToRemove, queryRegex) {
  return Object.keys(fileListByQuery)
    .reduce((newFileListByQuery, query) => {
      if (queryRegex.test(query)) {
        const existingFileList = fileListByQuery[query];
        const newFileIDs = existingFileList.fileIDs.filter(
          fileID => fileID !== fileIDToRemove
        );
        if (newFileIDs.length < existingFileList.fileIDs.length) {
          newFileListByQuery[query] = {
            ...existingFileList,
            fileIDs: newFileIDs,
          };
        } else {
          newFileListByQuery[query] = existingFileList;
        }
      }

      return newFileListByQuery;
    }, {});
}

function removeMatchingQueries(fileListByQuery, queryRegex) {
  return Object.keys(fileListByQuery)
    .reduce((newFileListByQuery, query) => {
      if (!queryRegex.test(query)) {
        newFileListByQuery[query] = fileListByQuery[query];
      }

      return newFileListByQuery;
    }, {});
}
