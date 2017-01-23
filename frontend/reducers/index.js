import { combineReducers } from 'redux'
import SessionReducer from './session_reducer'
import PocketReducer from './PocketReducer'
import AppReducer from './AppReducer'
import GmailReducer from './GmailReducer'
import ItemsReducer from './ItemsReducer'
import { routerReducer } from 'react-router-redux'

export default combineReducers({
  app: AppReducer,
  gmail: GmailReducer,
  items: ItemsReducer,
  pocket: PocketReducer,
  routing: routerReducer,
  session: SessionReducer
});
