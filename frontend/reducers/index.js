import { combineReducers } from 'redux'
import SessionReducer from './session_reducer'
import PocketReducer from './PocketReducer'
import AppReducer from './AppReducer'
import DriveReducer from './DriveReducer'
import GmailReducer from './GmailReducer'
import ItemsReducer from './ItemsReducer'
import LoadingReducer from './LoadingReducer'
import { routerReducer } from 'react-router-redux'

export default combineReducers({
  app: AppReducer,
  drive: DriveReducer,
  gmail: GmailReducer,
  isLoading: LoadingReducer,
  items: ItemsReducer,
  pocket: PocketReducer,
  routing: routerReducer,
  session: SessionReducer
});
