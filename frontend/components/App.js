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
  isFetchingSelector,
  hasMoreThreadsSelector,
  threadsByIDSelector,
} from '../selectors'

// const PAGE_SIZE = 20;

@connect(
  state => ({
    drawerOpen: drawerOpenSelector(state),
    searchQuery: searchQuerySelector(state),
    getAllItems: getAllItemsSelector(state),
    endOfList: endOfListSelector(state),
    gmailHasMoreThreads: hasMoreThreadsSelector(state),
    allAuth: allAuthSelector(state),
    isFetching: isFetchingSelector(state),
    gmailThreadsByID: threadsByIDSelector(state),
  }),
  dispatch => bindActionCreators({
    fetchPocketItems: PocketActions.fetchItems,
    pocketArchiveItem: PocketActions.archiveItem,
    pocketDeleteItem: PocketActions.deleteItem,
    toggleDrawer: AppActions.toggleDrawer,
    fetchEverything: AppActions.fetchEverything,
    dispatchAllItems: AppActions.dispatchAllItems,
    gmailLoadThreadList: GmailThreadActions.loadList,
    gmailTrashThread: GmailThreadActions.trash,
    gmailArchiveThread: GmailThreadActions.archive,
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
      searchQuery, gmailLoadThreadList, fetchEverything, gmailHasMoreThreads,
      dispatchAllItems, getAllItems
    } = this.props;

    let promiseArray = []

    if (allAuth.all && !isFetching.any) {
      if (allAuth.gmail && gmailHasMoreThreads) {
        promiseArray.push(gmailLoadThreadList(searchQuery));
      }

      if (allAuth.pocket) {
        promiseArray.push(fetchPocketItems());
      }

      if (allAuth.drive) {
        promiseArray.push(driveFetchFiles());
      }

      fetchEverything(promiseArray)
    }
  }

  handleRequestDelete = e => {
    e.preventDefault();
    alert('You clicked the delete button.');
  }

  _onLogoClick = () => {
    window.location.reload();
  }

  gmailLogin = () => {
    return window.gapi.auth2.getAuthInstance().then(GoogleAuth => {
      let isSignedIn = GoogleAuth.isSignedIn.get();
      if (isSignedIn) {
        this.gmailClientInit()
      } else {
        GoogleAuth.signIn().then(() => gmailClientInit());
      }
    })
  }

  gmailClientInit = () => {
    this.props.gmailAuthRequest();
    return window.gapi.client.init({
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
      clientId: '128518506637-qcrlhsu7pnivdarnagtshk9hdv600c4c.apps.googleusercontent.com',
      scope: "https://www.googleapis.com/auth/gmail.modify"
    }).then(res => {
      this.props.gmailAuthSuccess();
    }, err => {
      this.props.gmailAuthFailure();
    })
  }

  driveClientInit = () => {
    this.props.driveAuthRequest()
    return window.gapi.client.init({
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
      clientId: '128518506637-qcrlhsu7pnivdarnagtshk9hdv600c4c.apps.googleusercontent.com',
      scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.photos.readonly"
    }).then(res => {
      this.props.driveAuthSuccess()
    }, err => {
      this.props.driveAuthFailure()
    })
  }

  driveLogin = () => {
    return window.gapi.auth2.getAuthInstance().then(GoogleAuth => {
      let isSignedIn = GoogleAuth.isSignedIn.get();
      if (isSignedIn) {
        this.driveClientInit()
      } else {
        GoogleAuth.signIn().then(() => driveClientInit());
      }
    })
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
          // console.log(`currentUserEmail: ${currentUser.getBasicProfile().getEmail()}`)
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
              gmailLogin={this.gmailLogin}
              driveLogin={this.driveLogin}
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
            gmailTrashThread={this.props.gmailTrashThread}
            gmailArchiveThread={this.props.gmailArchiveThread}
            gmailThreadsByID={this.props.gmailThreadsByID}
            pocketArchiveItem={this.props.pocketArchiveItem}
            pocketDeleteItem={this.props.pocketDeleteItem}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
