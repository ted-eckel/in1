import { combineReducers } from 'redux'
import SessionReducer from './session_reducer'
import PocketReducer from './PocketReducer'
import AppReducer from './AppReducer'
import isRequestingReducer from './isRequestingReducer'
import GmailReducer from './GmailReducer'
import { routerReducer } from 'react-router-redux'

export default combineReducers({
  app: AppReducer,
  gmail: GmailReducer,
  isRequesting: isRequestingReducer,
  pocket: PocketReducer,
  routing: routerReducer,
  session: SessionReducer
});
