import { combineReducers } from 'redux'
import SessionReducer from './SessionReducer'
import PocketReducer from './PocketReducer'
import AppReducer from './AppReducer'
import DriveReducer from './DriveReducer'
import GmailReducer from './GmailReducer'
import NotesReducer from './NotesReducer'
import { routerReducer } from 'react-router-redux'

export default combineReducers({
  app: AppReducer,
  drive: DriveReducer,
  gmail: GmailReducer,
  notes: NotesReducer,
  pocket: PocketReducer,
  routing: routerReducer,
  session: SessionReducer,
});
