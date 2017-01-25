import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import SessionMiddleware from '../middleware/session_middleware'

const middleware = [ thunk, SessionMiddleware ]
if (process.env.NODE_ENV !== 'production') {
  const createLogger = require('redux-logger');
  const logger = createLogger();
  middleware.push(logger);
}

const composeEnhancers =
  process.env.NODE_ENV !=='production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      name: "in1box"
    }) : compose;

const configureStore = (preloadedState = {}) => createStore(
  reducer, preloadedState, composeEnhancers(
    applyMiddleware(...middleware)
  )
)

export default configureStore;
