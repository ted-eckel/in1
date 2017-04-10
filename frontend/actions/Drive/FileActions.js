import ActionType from '../ActionType';
import * as FileAPI from '../../util/Drive/FileAPI';
import { drivePageTokenSelector } from '../../selectors/index'

export const loadList = (
  // q = "'root' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false",
  q = `(not appProperties has { key='state' and value='archived' }) and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
  fields = "nextPageToken, files",
  spaces = 'drive,photos',
  pageSize = 20
) => (dispatch, getState) => {
    let { nextPageToken } = getState().drive;
    let pageToken = nextPageToken;


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
        pageSize
      })
    })
  }
