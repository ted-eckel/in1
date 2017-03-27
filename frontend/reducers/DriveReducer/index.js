import { combineReducers } from 'redux'
import AppReducer from './AppReducer'
import AuthorizationReducer from './AuthorizationReducer'
import FileListReducer from './FileListReducer'
import LoadingReducer from './LoadingReducer'
import PageTokenReducer from './PageTokenReducer'

export default combineReducers({
  app: AppReducer,
  authorization: AuthorizationReducer,
  fileList: FileListReducer,
  isLoading: LoadingReducer,
  nextPageToken: PageTokenReducer
});
