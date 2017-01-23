import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import App from './App'
import SessionFormContainer from './session_form/SessionFormContainer'
import { syncHistoryWithStore } from 'react-router-redux'

// const history = syncHistoryWithStore(hashHistory, store)

const Root = ({ store }) => (
  <Provider store={ store }>
    <Router history={ syncHistoryWithStore(hashHistory, store) }>
      <Route path="/" component={ App } >
        <Route path="thread/:threadID/message/:messageID" component={App} />
        <Route path="/login" component={ SessionFormContainer } />
        <Route path="/signup" component={ SessionFormContainer } />
      </Route>
    </Router>
  </Provider>
);

export default Root
