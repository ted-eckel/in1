import { combineReducers } from 'redux'
import SessionReducer from './session_reducer'
import PocketReducer from './PocketReducer'
import AppReducer from './AppReducer'
import GoogleReducer from './GoogleReducer'

export default combineReducers({
  app: AppReducer,
  google: GoogleReducer,
  pocket: PocketReducer,
  session: SessionReducer
});
