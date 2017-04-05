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


import * as PocketActions from '../actions/PocketActions'
import * as GoogleActions from '../actions/Google/GoogleActions'
import * as AppActions from '../actions/AppActions'
import * as GmailThreadActions from '../actions/Gmail/ThreadActions'
import * as FileActions from '../actions/Drive/FileActions'
import { push } from 'react-router-redux'

import {
  drawerOpenSelector,
  searchQuerySelector,
  getAllItemsSelector,
  endOfListSelector,
  allAuthSelector,
  servicesSelector,
  isFetchingSelector
} from '../selectors'

const PAGE_SIZE = 20;

@connect(
  state => ({
    drawerOpen: drawerOpenSelector(state),
    searchQuery: searchQuerySelector(state),
    getAllItems: getAllItemsSelector(state),
    endOfList: endOfListSelector(state),
    allAuth: allAuthSelector(state),
    services: servicesSelector(state),
    isFetching: isFetchingSelector(state),
  }),
  dispatch => bindActionCreators({
    fetchPocketItems: PocketActions.fetchItems,
    toggleDrawer: AppActions.toggleDrawer,
    fetchEverything: AppActions.fetchEverything,
    gmailLoadThreadList: GmailThreadActions.loadList,
    driveFetchFiles: FileActions.loadList,
    gmailAuthRequest: GoogleActions.gmailAuthRequest,
    driveAuthRequest: GoogleActions.driveAuthRequest,
    driveAuthSuccess: GoogleActions.driveAuthSuccess,
    driveAuthFailure: GoogleActions.driveAuthFailure,
    gmailAuthSuccess: GoogleActions.gmailAuthSuccess,
    gmailAuthFailure: GoogleActions.gmailAuthFailure,
    push
  }, dispatch),
)

class App extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired
  }

  handleLoadMore = () => {
    const {
      fetchPocketItems, endOfList, allAuth, isFetching, driveFetchFiles,
      searchQuery, services, gmailLoadThreadList, fetchEverything
    } = this.props;

    const fetchGmail = (searchQuery, maxResultCount) => {
      if (allAuth.gmail === true && isFetching.gmail === false) {
        gmailLoadThreadList(searchQuery, maxResultCount);
      }
    }

    const fetchPocket = () => {
      if (allAuth.pocket === true && isFetching.pocket === false) {
        fetchPocketItems()
      }
    }

    const fetchDrive = () => {
      if (allAuth.drive === true & isFetching.drive === false) {
        driveFetchFiles()
      }
    }

    if (allAuth.all !== null && isFetching.any === false) {
      fetchEverything([fetchGmail(), fetchPocket(), fetchDrive()]);
    }
  }

  handleRequestDelete = e => {
    e.preventDefault();
    alert('You clicked the delete button.');
  }

  _onLogoClick = () => {
    window.location.reload();
  }

  render() {
    let { driveAuthSuccess, driveAuthFailure, gmailAuthSuccess,
        gmailAuthFailure, gmailAuthRequest, driveAuthRequest } = this.props;

    window.handleGoogleClientLoad = () => {
      window.gapi.load('client:auth2', initClient);
    }

    const initClient = () => {
      window.gapi.auth2.init(
        {
          client_id: '128518506637-qcrlhsu7pnivdarnagtshk9hdv600c4c.apps.googleusercontent.com'
        }
      ).then(GoogleAuth => {
        let isSignedIn = GoogleAuth.isSignedIn.get();
        if (isSignedIn) {
          let currentUser = GoogleAuth.currentUser.get();
          let scopes = currentUser.getGrantedScopes();

          if (scopes.includes("https://www.googleapis.com/auth/gmail.modify")){
            gmailAuthRequest();
            window.gapi.client.load(
              "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
            )
            .then(() => gmailAuthSuccess())
          } else {
            gmailAuthFailure()
          }

          if (checkInclusion(scopes, [
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/drive.appdata",
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/drive.metadata",
            "https://www.googleapis.com/auth/drive.photos.readonly"
          ])) {
            driveAuthRequest();
            window.gapi.client.load(
              "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
            ).then(() => driveAuthSuccess())
          } else {
            driveAuthFailure()
          }
        } else {
          console.log("isSignedIn = false");
          driveAuthFailure();
          gmailAuthFailure();
        }
      });
    }

    const checkInclusion = (str, arr) => {
      for (let i = 0; i < arr.length; i++){
        if (str.includes(arr[i]) === false) { return false }
      }
      return true;
    }

    return (
      <MuiThemeProvider style={{width: "100%", height: "100%"}}>
        <div>
          <div>
            <Drawer
              drawerOpen={this.props.drawerOpen}
              toggleDrawer={this.props.toggleDrawer}
              allAuth={this.props.allAuth}
            />
          </div>
          <Bar />
          <Items
            allAuth={this.props.allAuth}
            handleRequestDelete={this.handleRequestDelete}
            handleLoadMore={this.handleLoadMore}
            drawerOpen={this.props.drawerOpen}
            items={this.props.getAllItems}
            endOfList={this.props.endOfList}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
