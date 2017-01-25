let createLogger = null;
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
if (process.env.NODE_ENV !== 'production') {
  createLogger = require('redux-logger');
}
// import createLogger from 'redux-logger'
import reducer from '../reducers'
import SessionMiddleware from '../middleware/session_middleware'

const middleware = [ thunk, SessionMiddleware ]
if (createLogger && process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const configureStore = (preloadedState = {}) => createStore(
  reducer, preloadedState, composeEnhancers(
    applyMiddleware(...middleware)
  )
)

export default configureStore;
