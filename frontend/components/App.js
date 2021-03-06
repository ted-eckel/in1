/** @flow */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from "react-tap-event-plugin"
injectTapEventPlugin();
import Bar from './Bar'
import Drawer from './Drawer'
import Items from './Items'
import CreateNoteModal from './CreateNoteModal'
import KeepModal from './KeepModal'
import FAB from './FAB'
import { initClient } from '../util/API'
import ActionType from '../actions/ActionType'

// const PAGE_SIZE = 20;

@connect(
  state => state,
  dispatch => bindActionCreators({
    initClient: initClient,
    driveAuthFailure: () => dispatch({type: ActionType.Drive.Authorization.FAILURE}),
    gmailAuthFailure: () => dispatch({type: ActionType.Gmail.Authorization.FAILURE}),
  }, dispatch),
)

export default class App extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired
  }

  // componentWillMount() {
  //   this.props.driveAuthFailure();
  //   this.props.gmailAuthFailure();
  // }

  render() {
    window.handleGoogleClientLoad = () => {
      window.gapi.load('client:auth2', this.props.initClient);
    }

    return (
      <MuiThemeProvider style={{width: "100%", height: "100%"}}>
        <div>
          <Drawer />
          <Bar />
          <Items />
          <KeepModal />
          <CreateNoteModal />
          <FAB />
        </div>
      </MuiThemeProvider>
    )
  }
}
