import { combineReducers } from 'redux'
import SessionReducer from './session_reducer'
import PocketReducer from './PocketReducer'

export default combineReducers({
  session: SessionReducer,
  pocket: PocketReducer
});
