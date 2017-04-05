import { combineReducers } from 'redux'
import SessionReducer from './SessionReducer'
import PocketReducer from './PocketReducer'
import AppReducer from './AppReducer'
import DriveReducer from './DriveReducer'
import GmailReducer from './GmailReducer'
import { routerReducer } from 'react-router-redux'
import ServiceReducer from './ServiceReducer'

export default combineReducers({
  app: AppReducer,
  drive: DriveReducer,
  gmail: GmailReducer,
  pocket: PocketReducer,
  routing: routerReducer,
  session: SessionReducer,
  service: ServiceReducer
});
