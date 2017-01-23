import { combineReducers } from 'redux'
import AppReducer from './AppReducer';
import AuthorizationReducer from './AuthorizationReducer';
import LabelReducer from './LabelReducer';
import LoadingReducer from './LoadingReducer';
import MessageReducer from './MessageReducer';
import ThreadReducer from './ThreadReducer';
import ThreadListReducer from './ThreadListReducer';

export default combineReducers({
  app: AppReducer,
  authorization: AuthorizationReducer,
  isLoading: LoadingReducer,
  labels: LabelReducer,
  messagesByID: MessageReducer,
  threadListByQuery: ThreadListReducer,
  threadsByID: ThreadReducer,
});
