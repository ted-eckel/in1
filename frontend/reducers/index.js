import { combineReducers } from 'redux'
import SessionReducer from './session_reducer'
import PocketReducer from './PocketReducer'
import AppReducer from './AppReducer'

export default combineReducers({
  app: AppReducer,
  pocket: PocketReducer,
  session: SessionReducer
});
