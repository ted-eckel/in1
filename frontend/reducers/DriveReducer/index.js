import { combineReducers } from 'redux'
import AppReducer from './AppReducer'
import AuthorizationReducer from './AuthorizationReducer'
import FileListReducer from './FileListReducer'
import FetchingReducer from './FetchingReducer'
import PageTokenReducer from './PageTokenReducer'

export default combineReducers({
  app: AppReducer,
  authorization: AuthorizationReducer,
  fileList: FileListReducer,
  isFetching: FetchingReducer,
  nextPageToken: PageTokenReducer
});
