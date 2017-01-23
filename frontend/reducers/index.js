import { combineReducers } from 'redux'
import SessionReducer from './session_reducer'
import PocketReducer from './PocketReducer'
import AppReducer from './AppReducer'
import GoogleReducer from './GoogleReducer'
import GmailReducer from './GmailReducer'
import { routerReducer } from 'react-router-redux'

export default combineReducers({
  app: AppReducer,
  // google: GoogleReducer,
  gmail: GmailReducer,
  pocket: PocketReducer,
  routing: routerReducer,
  session: SessionReducer
});
