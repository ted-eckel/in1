import ActionType from '../ActionType';
import * as FileAPI from '../../util/Drive/FileAPI';

export const loadList = (
  // q = "'root' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false",
  // q = `(not appProperties has { key='state' and value='archived' }) and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
  q = "mimeType != 'application/vnd.google-apps.folder' and trashed = false",
  fields = "nextPageToken, files",
  spaces = 'drive,photos',
  pageSize = 20
) => (dispatch, getState) => {
    const { fileListByQuery } = getState().drive;
    const fileList = fileListByQuery[q];

    let pageToken = null;
    if (fileList) {
      pageToken = fileList.nextPageToken;
      if (!pageToken) {
        return;
      }
    }

    dispatch({
      type: ActionType.Drive.File.FETCH_LIST_REQUEST,
      q,
      fields,
      spaces,
      pageSize,
      pageToken
    });

    FileAPI.list({
      q,
      fields,
      spaces,
      pageSize,
      pageToken
    }).then(listResult => {
      dispatch({
        type: ActionType.Drive.File.FETCH_LIST_SUCCESS,
        q,
        fields,
        spaces,
        pageSize,
        files: listResult.files,
        nextPageToken: listResult.nextPageToken,
      });
    }, error => {
      dispatch({
        type: ActionType.Drive.File.FETCH_LIST_FAILURE,
        q,
        fields,
        spaces,
        pageSize,
        error
      })
    })
  }

  export const trash = fileID => dispatch => {
    dispatch({
      type: ActionType.Drive.File.TRASH_REQUEST,
      fileID
    });

    FileAPI.trash({fileID}).then(res => {
      dispatch({type: ActionType.Drive.File.TRASH_SUCCESS, fileID, res})
    }, err => {
      dispatch({type: ActionType.Drive.File.TRASH_FAILURE, fileID, err})
    })
  }
